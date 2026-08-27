using Workora.Application.Common.Interfaces;
using Workora.Domain.Interfaces;

namespace Workora.Infrastructure.Services;

/// <summary>
/// Service implementation for resolving the tenant company scope for the current authenticated user context.
/// Enforces multi-tenant data boundaries and prevents cross-tenant data leaks.
/// </summary>
public class TenantResolutionService : ITenantResolutionService
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserRepository _userRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ICompanyRepository _companyRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="TenantResolutionService"/> class.
    /// </summary>
    public TenantResolutionService(
        ICurrentUserService currentUserService,
        IUserRepository userRepository,
        IEmployeeRepository employeeRepository,
        ICompanyRepository companyRepository)
    {
        _currentUserService = currentUserService;
        _userRepository = userRepository;
        _employeeRepository = employeeRepository;
        _companyRepository = companyRepository;
    }

    /// <inheritdoc />
    public async Task<int?> GetCurrentCompanyIdAsync(int? requestedCompanyId = null, CancellationToken ct = default)
    {
        // 1. SuperAdmin: Master platform view (can view any specific requested company or all companies)
        if (_currentUserService.IsInRole("SuperAdmin"))
        {
            return requestedCompanyId;
        }

        if (!_currentUserService.UserId.HasValue)
        {
            return -1; // Unauthenticated or missing user ID must NEVER see global data
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return -1;
        }

        // 2. Direct Employee Profile Link on User
        if (user.EmployeeId.HasValue)
        {
            var employee = await _employeeRepository.GetWithFullDetailsAsync(user.EmployeeId.Value, ct);
            if (employee != null)
            {
                var cid = employee.Department?.CompanyId ?? employee.Branch?.CompanyId;
                if (cid.HasValue && cid.Value > 0)
                {
                    return cid.Value;
                }
            }
        }

        // 3. Reverse Link: Employee entity referencing this User.Id
        var empByUserId = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (empByUserId != null)
        {
            var cid = empByUserId.Department?.CompanyId ?? empByUserId.Branch?.CompanyId;
            if (cid.HasValue && cid.Value > 0)
            {
                return cid.Value;
            }
        }

        // 4. Match Company by Email or Domain
        var company = await _companyRepository.GetByEmailOrDomainAsync(user.Email.Value, ct);
        if (company != null)
        {
            return company.Id;
        }

        // 5. If non-SuperAdmin user is unlinked, return -1 (an empty scope)
        // so query filters `.Where(x => x.CompanyId == -1)` will return empty instead of all tenants
        return -1;
    }
}
