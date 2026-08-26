using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="Employee"/> aggregates.
/// </summary>
public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="EmployeeRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public EmployeeRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<Employee?> GetByNationalIdAsync(string nationalId, CancellationToken ct = default)
    {
        var norm = nationalId.Trim().ToUpperInvariant();
        return await _dbContext.Employees
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Branch)
            .FirstOrDefaultAsync(e => e.NationalId == norm, ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsNationalIdUniqueAsync(string nationalId, int? excludeId = null, CancellationToken ct = default)
    {
        var norm = nationalId.Trim().ToUpperInvariant();
        return !await _dbContext.Employees
            .AnyAsync(e => e.NationalId == norm && (!excludeId.HasValue || e.Id != excludeId.Value), ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsEmailUniqueAsync(EmailAddress email, int? excludeId = null, CancellationToken ct = default)
    {
        return !await _dbContext.Employees
            .AnyAsync(e => e.Email == email && (!excludeId.HasValue || e.Id != excludeId.Value), ct);
    }

    /// <inheritdoc />
    public async Task<Employee?> GetByUserIdAsync(int userId, CancellationToken ct = default)
    {
        return await _dbContext.Employees
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Branch)
            .Include(e => e.Manager)
            .Include(e => e.EmergencyContacts)
            .Include(e => e.BankDetails)
            .FirstOrDefaultAsync(e => e.UserId == userId, ct);
    }

    /// <inheritdoc />
    public async Task<Employee?> GetWithFullDetailsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Employees
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Branch)
            .Include(e => e.Manager)
            .Include(e => e.User)
            .Include(e => e.EmergencyContacts)
            .Include(e => e.BankDetails)
            .Include(e => e.EmploymentHistory)
            .FirstOrDefaultAsync(e => e.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Employee>> GetDirectReportsAsync(int managerId, CancellationToken ct = default)
    {
        return await _dbContext.Employees
            .AsNoTracking()
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Branch)
            .Where(e => e.ManagerId == managerId)
            .OrderBy(e => e.FirstName)
            .ThenBy(e => e.LastName)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCountForCodeGenerationAsync(int year, CancellationToken ct = default)
    {
        return await _dbContext.Employees.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Employee>> GetPagedListAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm = null,
        int? departmentId = null,
        int? designationId = null,
        int? branchId = null,
        EmploymentStatus? status = null,
        int? companyId = null,
        CancellationToken ct = default)
    {
        var query = BuildFilteredQuery(searchTerm, departmentId, designationId, branchId, status, companyId);

        return await query
            .OrderBy(e => e.FirstName)
            .ThenBy(e => e.LastName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCountAsync(
        string? searchTerm = null,
        int? departmentId = null,
        int? designationId = null,
        int? branchId = null,
        EmploymentStatus? status = null,
        int? companyId = null,
        CancellationToken ct = default)
    {
        var query = BuildFilteredQuery(searchTerm, departmentId, designationId, branchId, status, companyId);
        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Employee>> GetExportListAsync(
        string? searchTerm = null,
        int? departmentId = null,
        int? designationId = null,
        int? branchId = null,
        EmploymentStatus? status = null,
        int? companyId = null,
        CancellationToken ct = default)
    {
        var query = BuildFilteredQuery(searchTerm, departmentId, designationId, branchId, status, companyId);
        return await query
            .OrderBy(e => e.FirstName)
            .ThenBy(e => e.LastName)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task AddEmergencyContactAsync(EmployeeEmergencyContact contact, CancellationToken ct = default)
    {
        await _dbContext.Set<EmployeeEmergencyContact>().AddAsync(contact, ct);
    }

    /// <inheritdoc />
    public async Task UpsertBankDetailAsync(EmployeeBankDetail bankDetail, CancellationToken ct = default)
    {
        if (bankDetail.Id == 0)
        {
            await _dbContext.Set<EmployeeBankDetail>().AddAsync(bankDetail, ct);
        }
        else
        {
            _dbContext.Set<EmployeeBankDetail>().Update(bankDetail);
        }
    }

    private IQueryable<Employee> BuildFilteredQuery(
        string? searchTerm,
        int? departmentId,
        int? designationId,
        int? branchId,
        EmploymentStatus? status,
        int? companyId)
    {
        var query = _dbContext.Employees
            .AsNoTracking()
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Branch)
            .Include(e => e.Manager)
            .AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(e => (e.Department != null && e.Department.CompanyId == companyId.Value) ||
                                     (e.Branch != null && e.Branch.CompanyId == companyId.Value));
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(e =>
                e.FirstName.ToLower().Contains(term) ||
                e.LastName.ToLower().Contains(term) ||
                e.EmployeeCode.ToLower().Contains(term) ||
                ((string)(object)e.Email).ToLower().Contains(term) ||
                e.NationalId.ToLower().Contains(term));
        }

        if (departmentId.HasValue)
        {
            query = query.Where(e => e.DepartmentId == departmentId.Value);
        }

        if (designationId.HasValue)
        {
            query = query.Where(e => e.DesignationId == designationId.Value);
        }

        if (branchId.HasValue)
        {
            query = query.Where(e => e.BranchId == branchId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(e => e.EmploymentStatus == status.Value);
        }

        return query;
    }
}
