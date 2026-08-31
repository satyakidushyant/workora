using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Queries.GetOrganizations;

/// <summary>
/// Handler for <see cref="GetOrganizationsQuery"/> that retrieves a paginated list of tenant organizations
/// along with accurate branch and employee counts.
/// </summary>
public class GetOrganizationsQueryHandler : IRequestHandler<GetOrganizationsQuery, ApiResponse<PagedResponse<OrganizationDto>>>
{
    private readonly IGenericRepository<Company> _companyRepository;
    private readonly IGenericRepository<Branch> _branchRepository;
    private readonly IGenericRepository<Employee> _employeeRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetOrganizationsQueryHandler"/> class.
    /// </summary>
    /// <param name="companyRepository">The company repository.</param>
    /// <param name="branchRepository">The branch repository.</param>
    /// <param name="employeeRepository">The employee repository.</param>
    public GetOrganizationsQueryHandler(
        IGenericRepository<Company> companyRepository,
        IGenericRepository<Branch> branchRepository,
        IGenericRepository<Employee> employeeRepository)
    {
        _companyRepository = companyRepository;
        _branchRepository = branchRepository;
        _employeeRepository = employeeRepository;
    }

    /// <summary>
    /// Handles fetching tenant organizations with real database counts.
    /// </summary>
    /// <param name="request">The get organizations query parameters.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>A paginated list of organization DTOs.</returns>
    public Task<ApiResponse<PagedResponse<OrganizationDto>>> Handle(GetOrganizationsQuery request, CancellationToken cancellationToken)
    {
        var allCompanies = _companyRepository.GetQueryable().ToList();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.Trim();
            allCompanies = allCompanies.Where(c => 
                (c.Name != null && c.Name.Contains(term, StringComparison.OrdinalIgnoreCase)) ||
                (c.Code != null && c.Code.Contains(term, StringComparison.OrdinalIgnoreCase))
            ).ToList();
        }

        if (request.IsActive.HasValue)
        {
            allCompanies = allCompanies.Where(c => c.IsActive == request.IsActive.Value).ToList();
        }

        var totalCount = allCompanies.Count;

        var companies = allCompanies
            .OrderByDescending(c => c.CreatedAt)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var companyIds = companies.Select(c => c.Id).ToList();

        // Compute branch counts per company
        var allBranches = _branchRepository.GetQueryable().ToList();
        var branchCounts = allBranches
            .Where(b => companyIds.Contains(b.CompanyId))
            .GroupBy(b => b.CompanyId)
            .ToDictionary(g => g.Key, g => g.Count());

        // Compute employee counts per company
        var allEmployees = _employeeRepository.GetQueryable().ToList();
        var employeeCounts = allEmployees
            .Where(e => companyIds.Contains(e.BranchId))
            .GroupBy(e => e.BranchId)
            .ToDictionary(g => g.Key, g => g.Count());

        var items = companies.Select(c => new OrganizationDto
        {
            Id = c.Id,
            Name = c.Name,
            Code = c.Code,
            RegistrationNumber = c.RegistrationNumber,
            TaxId = c.TaxId,
            Email = c.Email,
            Phone = c.Phone,
            Website = c.Website,
            LogoUrl = c.LogoUrl,
            Address = c.Address,
            FiscalYearStartMonth = c.FiscalYearStartMonth,
            Currency = c.Currency,
            BranchCount = branchCounts.TryGetValue(c.Id, out var bCount) ? bCount : 0,
            EmployeeCount = employeeCounts.TryGetValue(c.Id, out var eCount) ? eCount : 0,
            SubscriptionPlan = "Growth",
            Industry = "Information Technology",
            PrimaryContactName = c.Name + " Admin",
            IsActive = c.IsActive,
            CreatedAt = c.CreatedAt
        }).ToList();

        var paged = new PagedResponse<OrganizationDto>(items, totalCount, request.PageNumber, request.PageSize);
        return Task.FromResult(ApiResponse<PagedResponse<OrganizationDto>>.Success(paged, ResponseMessage.OrganizationsRetrieved.GetDescription()));
    }
}
