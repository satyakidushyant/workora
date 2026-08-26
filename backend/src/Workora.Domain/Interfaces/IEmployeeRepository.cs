using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.ValueObjects;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for <see cref="Employee"/> aggregate roots.
/// </summary>
public interface IEmployeeRepository : IRepository<Employee>
{
    /// <summary>
    /// Gets an employee by their unique national identification number.
    /// </summary>
    Task<Employee?> GetByNationalIdAsync(string nationalId, CancellationToken ct = default);

    /// <summary>
    /// Checks if a national identification number is unique across all employees.
    /// </summary>
    Task<bool> IsNationalIdUniqueAsync(string nationalId, int? excludeId = null, CancellationToken ct = default);

    /// <summary>
    /// Checks if an email is unique across all employees.
    /// </summary>
    Task<bool> IsEmailUniqueAsync(EmailAddress email, int? excludeId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets an employee by their linked user ID.
    /// </summary>
    Task<Employee?> GetByUserIdAsync(int userId, CancellationToken ct = default);

    /// <summary>
    /// Gets an employee with fully loaded relations (Department, Designation, Branch, Manager, Contacts, BankDetails).
    /// </summary>
    Task<Employee?> GetWithFullDetailsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets direct reporting employees for a given manager ID.
    /// </summary>
    Task<IReadOnlyList<Employee>> GetDirectReportsAsync(int managerId, CancellationToken ct = default);

    /// <summary>
    /// Gets the total number of employees for auto-generating employee sequential codes.
    /// </summary>
    Task<int> GetCountForCodeGenerationAsync(int year, CancellationToken ct = default);

    /// <summary>
    /// Gets a paginated list of employees with comprehensive filtering.
    /// </summary>
    Task<IReadOnlyList<Employee>> GetPagedListAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm = null,
        int? departmentId = null,
        int? designationId = null,
        int? branchId = null,
        EmploymentStatus? status = null,
        int? companyId = null,
        CancellationToken ct = default);

    /// <summary>
    /// Gets the count of employees matching filters.
    /// </summary>
    Task<int> GetCountAsync(
        string? searchTerm = null,
        int? departmentId = null,
        int? designationId = null,
        int? branchId = null,
        EmploymentStatus? status = null,
        int? companyId = null,
        CancellationToken ct = default);

    /// <summary>
    /// Gets filtered employees for export without pagination caps.
    /// </summary>
    Task<IReadOnlyList<Employee>> GetExportListAsync(
        string? searchTerm = null,
        int? departmentId = null,
        int? designationId = null,
        int? branchId = null,
        EmploymentStatus? status = null,
        int? companyId = null,
        CancellationToken ct = default);

    /// <summary>
    /// Adds an emergency contact for an employee.
    /// </summary>
    Task AddEmergencyContactAsync(EmployeeEmergencyContact contact, CancellationToken ct = default);

    /// <summary>
    /// Adds or updates bank details for an employee.
    /// </summary>
    Task UpsertBankDetailAsync(EmployeeBankDetail bankDetail, CancellationToken ct = default);
}
