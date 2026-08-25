using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;

namespace Workora.Application.Features.Employees.Commands.BulkImportEmployees;

/// <summary>
/// Model for a single employee record in a bulk import request.
/// </summary>
public record BulkEmployeeItemDto(
    string EmployeeCode,
    string FirstName,
    string LastName,
    string Email,
    string NationalId,
    DateOnly DateOfBirth,
    DateOnly JoiningDate,
    Gender Gender,
    EmploymentType EmploymentType,
    int BranchId,
    int DepartmentId,
    int DesignationId,
    string? Phone = null);

/// <summary>
/// Command to bulk upload employee records.
/// </summary>
public record BulkImportEmployeesCommand(List<BulkEmployeeItemDto> Employees) : IRequest<ApiResponse<int>>;

/// <summary>
/// Validator for <see cref="BulkImportEmployeesCommand"/>.
/// </summary>
public class BulkImportEmployeesCommandValidator : AbstractValidator<BulkImportEmployeesCommand>
{
    /// <summary>
    /// Initializes validation rules for BulkImportEmployeesCommand.
    /// </summary>
    public BulkImportEmployeesCommandValidator()
    {
        RuleFor(x => x.Employees)
            .NotEmpty().WithMessage("Employee bulk import list cannot be empty.");
    }
}

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
