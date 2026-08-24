using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.AssignSalaryStructure;

/// <summary>
/// Command to assign a salary compensation structure and base pay rate to an employee.
/// </summary>
public record AssignSalaryStructureCommand(
    int EmployeeId,
    int SalaryStructureId,
    decimal BaseSalary,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Validator for <see cref="AssignSalaryStructureCommand"/>.
/// </summary>
public class AssignSalaryStructureCommandValidator : AbstractValidator<AssignSalaryStructureCommand>
{
    /// <summary>
    /// Initializes validation rules for assigning a salary structure.
    /// </summary>
    public AssignSalaryStructureCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.SalaryStructureId).GreaterThan(0).WithMessage("Valid salary structure ID is required.");
        RuleFor(x => x.BaseSalary).GreaterThan(0).WithMessage("Base salary must be greater than zero.");
    }
}

/// <summary>
/// Handler for <see cref="AssignSalaryStructureCommand"/>.
/// </summary>
public class AssignSalaryStructureCommandHandler : IRequestHandler<AssignSalaryStructureCommand, ApiResponse<bool>>
{
    private readonly ISalaryStructureRepository _salaryStructureRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="AssignSalaryStructureCommandHandler"/> class.
    /// </summary>
    public AssignSalaryStructureCommandHandler(
        ISalaryStructureRepository salaryStructureRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork)
    {
        _salaryStructureRepository = salaryStructureRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(AssignSalaryStructureCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var structure = await _salaryStructureRepository.GetByIdAsync(request.SalaryStructureId, ct);
        if (structure == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.SalaryStructureNotFound.GetDescription());
        }

        var activeAssignment = await _salaryStructureRepository.GetActiveEmployeeAssignmentAsync(request.EmployeeId, request.EffectiveFrom, ct);
        if (activeAssignment != null)
        {
            activeAssignment.EndAssignment(request.EffectiveFrom.AddDays(-1));
        }

        var assignment = EmployeeSalaryAssignment.Create(
            request.EmployeeId,
            request.SalaryStructureId,
            request.BaseSalary,
            request.EffectiveFrom,
            request.EffectiveTo);

        await _salaryStructureRepository.AssignStructureAsync(assignment, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.SalaryStructureAssigned.GetDescription());
    }
}
