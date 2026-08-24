using AutoMapper;
using MediatR;
using Workora.Application.Features.Companies.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.Queries.GetCompanyProfile;

/// <summary>
/// Query to get the default or primary company profile.
/// </summary>
public record GetCompanyProfileQuery(int? CompanyId = null) : IRequest<ApiResponse<CompanyDto>>;

/// <summary>
/// Handler for <see cref="GetCompanyProfileQuery"/>.
/// </summary>
public class GetCompanyProfileQueryHandler : IRequestHandler<GetCompanyProfileQuery, ApiResponse<CompanyDto>>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetCompanyProfileQueryHandler"/> class.
    /// </summary>
    public GetCompanyProfileQueryHandler(ICompanyRepository companyRepository, IMapper mapper)
    {
        _companyRepository = companyRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<CompanyDto>> Handle(GetCompanyProfileQuery request, CancellationToken ct)
    {
        var company = request.CompanyId.HasValue
            ? await _companyRepository.GetByIdAsync(request.CompanyId.Value, ct)
            : await _companyRepository.GetDefaultCompanyAsync(ct);

        if (company == null)
        {
            return ApiResponse<CompanyDto>.Fail("Company profile not found.");
        }

        var dto = _mapper.Map<CompanyDto>(company);
        return ApiResponse<CompanyDto>.Success(dto);
    }
}
