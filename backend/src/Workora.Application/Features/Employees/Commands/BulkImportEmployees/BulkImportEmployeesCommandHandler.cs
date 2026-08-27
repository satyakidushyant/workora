using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;

using Workora.Application.Features.Employees.DTOs;
namespace Workora.Application.Features.Employees.Commands.BulkImportEmployees;

/// <summary>
/// Handler for <see cref="BulkImportEmployeesCommand"/>.
/// </summary>
public class BulkImportEmployeesCommandHandler : IRequestHandler<BulkImportEmployeesCommand, ApiResponse<int>>
{
    private readonly IGenericRepository<Employee> _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="BulkImportEmployeesCommandHandler"/> class.
    /// </summary>
    public BulkImportEmployeesCommandHandler(
        IGenericRepository<Employee> employeeRepository,
        IUnitOfWork unitOfWork)
    {
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes bulk employee import.
    /// </summary>
    public async Task<ApiResponse<int>> Handle(BulkImportEmployeesCommand request, CancellationToken cancellationToken)
    {
        int count = 0;
        foreach (var item in request.Employees)
        {
            var emailVo = EmailAddress.Create(item.Email);
            var emp = Employee.Create(
                item.EmployeeCode,
                item.FirstName,
                item.LastName,
                emailVo,
                item.Phone,
                string.IsNullOrWhiteSpace(item.NationalId) ? $"NAT-{Guid.NewGuid():N}"[..12] : item.NationalId,
                item.DateOfBirth,
                item.Gender,
                MaritalStatus.Single,
                item.JoiningDate,
                item.DepartmentId,
                item.DesignationId,
                item.BranchId,
                null,
                null,
                EmploymentStatus.Active,
                item.EmploymentType);

            await _employeeRepository.AddAsync(emp, cancellationToken);
            count++;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return ApiResponse<int>.Success(count, $"{count} employees imported successfully.");
    }
}
