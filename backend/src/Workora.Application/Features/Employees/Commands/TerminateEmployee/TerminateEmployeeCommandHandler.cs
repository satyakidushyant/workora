using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Employees.DTOs;
namespace Workora.Application.Features.Employees.Commands.TerminateEmployee;

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
