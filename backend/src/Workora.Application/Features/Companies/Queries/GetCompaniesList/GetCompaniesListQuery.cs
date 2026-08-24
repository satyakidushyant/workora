using AutoMapper;
using MediatR;
using Workora.Application.Features.Companies.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.Queries.GetCompaniesList;

/// <summary>
/// Query to list all companies (for multi-tenant SuperAdmin accounts).
/// </summary>
public record GetCompaniesListQuery : IRequest<ApiResponse<IReadOnlyList<CompanyDto>>>;

/// <summary>
/// Handler for <see cref="GetCompaniesListQuery"/>.
/// </summary>
public class GetCompaniesListQueryHandler : IRequestHandler<GetCompaniesListQuery, ApiResponse<IReadOnlyList<CompanyDto>>>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetCompaniesListQueryHandler"/> class.
    /// </summary>
    public GetCompaniesListQueryHandler(ICompanyRepository companyRepository, IMapper mapper)
    {
        _companyRepository = companyRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<CompanyDto>>> Handle(GetCompaniesListQuery request, CancellationToken ct)
    {
        var companies = await _companyRepository.GetAllCompaniesAsync(ct);
        var dtos = _mapper.Map<IReadOnlyList<CompanyDto>>(companies);
        return ApiResponse<IReadOnlyList<CompanyDto>>.Success(dtos);
    }
}
