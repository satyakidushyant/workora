using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.TerminateEmployee;

/// <summary>
/// Command to terminate an employee's employment.
/// </summary>
public record TerminateEmployeeCommand(
    int Id,
    DateOnly TerminationDate,
    string? Reason) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Validator for <see cref="TerminateEmployeeCommand"/>.
/// </summary>
public class TerminateEmployeeCommandValidator : AbstractValidator<TerminateEmployeeCommand>
{
    /// <summary>
    /// Initializes validation rules for terminating an employee.
    /// </summary>
    public TerminateEmployeeCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid employee ID is required.");
    }
}

/// <summary>
/// Handler for <see cref="TerminateEmployeeCommand"/>.
/// </summary>
public class TerminateEmployeeCommandHandler : IRequestHandler<TerminateEmployeeCommand, ApiResponse<bool>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="TerminateEmployeeCommandHandler"/> class.
    /// </summary>
    public TerminateEmployeeCommandHandler(IEmployeeRepository employeeRepository, IUnitOfWork unitOfWork)
    {
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(TerminateEmployeeCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetWithFullDetailsAsync(request.Id, ct);
        if (employee == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        employee.Terminate(request.TerminationDate, request.Reason);
        _employeeRepository.Update(employee);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.EmployeeTerminated.GetDescription());
    }
}
