using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Companies.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.Queries.GetCompanyProfile;

/// <summary>
/// Handler for <see cref="GetCompanyProfileQuery"/>.
/// </summary>
public class GetCompanyProfileQueryHandler : IRequestHandler<GetCompanyProfileQuery, ApiResponse<CompanyDto>>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetCompanyProfileQueryHandler"/> class.
    /// </summary>
    public GetCompanyProfileQueryHandler(
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
    public async Task<ApiResponse<CompanyDto>> Handle(GetCompanyProfileQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);

        Domain.Entities.Company? company = null;
        if (targetCompanyId.HasValue && targetCompanyId.Value > 0)
        {
            company = await _companyRepository.GetByIdAsync(targetCompanyId.Value, ct);
        }
        else if (_currentUserService.IsInRole("SuperAdmin"))
        {
            company = await _companyRepository.GetDefaultCompanyAsync(ct);
        }

        if (company == null)
        {
            return ApiResponse<CompanyDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var dto = _mapper.Map<CompanyDto>(company);
        return ApiResponse<CompanyDto>.Success(dto);
    }
}
