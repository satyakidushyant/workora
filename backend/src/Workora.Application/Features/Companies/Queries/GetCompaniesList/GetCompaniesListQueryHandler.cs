using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Companies.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.Queries.GetCompaniesList;

/// <summary>
/// Handler for <see cref="GetCompaniesListQuery"/>.
/// Returns all companies for SuperAdmin users, or strictly the tenant company for tenant users.
/// </summary>
public class GetCompaniesListQueryHandler : IRequestHandler<GetCompaniesListQuery, ApiResponse<IReadOnlyList<CompanyDto>>>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetCompaniesListQueryHandler"/> class.
    /// </summary>
    public GetCompaniesListQueryHandler(
        ICompanyRepository companyRepository,
        ITenantResolutionService tenantResolutionService,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _companyRepository = companyRepository;
        _tenantResolutionService = tenantResolutionService;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<CompanyDto>>> Handle(GetCompaniesListQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(ct: ct);

        IReadOnlyList<Company> companies;
        if (targetCompanyId.HasValue && targetCompanyId.Value > 0)
        {
            var company = await _companyRepository.GetByIdAsync(targetCompanyId.Value, ct);
            companies = company != null ? new List<Company> { company } : new List<Company>();
        }
        else if (_currentUserService.IsInRole("SuperAdmin"))
        {
            companies = await _companyRepository.GetAllCompaniesAsync(ct);
        }
        else
        {
            companies = new List<Company>();
        }

        var dtos = _mapper.Map<IReadOnlyList<CompanyDto>>(companies);
        return ApiResponse<IReadOnlyList<CompanyDto>>.Success(dtos);
    }
}
