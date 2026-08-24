using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Commands.UnassignShift;

/// <summary>
/// Command to end / unassign an active shift from an employee.
/// </summary>
public record UnassignShiftCommand(int EmployeeId, DateOnly EffectiveTo) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Validator for <see cref="UnassignShiftCommand"/>.
/// </summary>
public class UnassignShiftCommandValidator : AbstractValidator<UnassignShiftCommand>
{
    /// <summary>
    /// Initializes validation rules for unassigning a shift.
    /// </summary>
    public UnassignShiftCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
    }
}

/// <summary>
/// Handler for <see cref="UnassignShiftCommand"/>.
/// </summary>
public class UnassignShiftCommandHandler : IRequestHandler<UnassignShiftCommand, ApiResponse<bool>>
{
    private readonly IShiftRepository _shiftRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="UnassignShiftCommandHandler"/> class.
    /// </summary>
    public UnassignShiftCommandHandler(IShiftRepository shiftRepository, IUnitOfWork unitOfWork)
    {
        _shiftRepository = shiftRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(UnassignShiftCommand request, CancellationToken ct)
    {
        var activeAssignment = await _shiftRepository.GetActiveAssignmentAsync(request.EmployeeId, request.EffectiveTo, ct);
        if (activeAssignment == null)
        {
            return ApiResponse<bool>.Fail("No active shift assignment found for this employee.");
        }

        activeAssignment.EndAssignment(request.EffectiveTo);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.ShiftUnassigned.GetDescription());
    }
}
