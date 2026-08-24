using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Commands.AssignShift;

/// <summary>
/// Command to assign a shift to an employee.
/// </summary>
public record AssignShiftCommand(
    int EmployeeId,
    int ShiftId,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Validator for <see cref="AssignShiftCommand"/>.
/// </summary>
public class AssignShiftCommandValidator : AbstractValidator<AssignShiftCommand>
{
    /// <summary>
    /// Initializes validation rules for shift assignment.
    /// </summary>
    public AssignShiftCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.ShiftId).GreaterThan(0).WithMessage("Valid shift ID is required.");
    }
}

/// <summary>
/// Handler for <see cref="AssignShiftCommand"/>.
/// </summary>
public class AssignShiftCommandHandler : IRequestHandler<AssignShiftCommand, ApiResponse<bool>>
{
    private readonly IShiftRepository _shiftRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="AssignShiftCommandHandler"/> class.
    /// </summary>
    public AssignShiftCommandHandler(
        IShiftRepository shiftRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork)
    {
        _shiftRepository = shiftRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(AssignShiftCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var shift = await _shiftRepository.GetByIdAsync(request.ShiftId, ct);
        if (shift == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.ShiftNotFound.GetDescription());
        }

        var activeAssignment = await _shiftRepository.GetActiveAssignmentAsync(request.EmployeeId, request.EffectiveFrom, ct);
        if (activeAssignment != null)
        {
            activeAssignment.EndAssignment(request.EffectiveFrom.AddDays(-1));
        }

        var assignment = EmployeeShiftAssignment.Create(request.EmployeeId, request.ShiftId, request.EffectiveFrom, request.EffectiveTo);
        await _shiftRepository.AssignShiftAsync(assignment, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.ShiftAssigned.GetDescription());
    }
}
