using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Queries.GetOrganizationById;

/// <summary>
/// Handler for <see cref="GetOrganizationByIdQuery"/>.
/// </summary>
public class GetOrganizationByIdQueryHandler : IRequestHandler<GetOrganizationByIdQuery, ApiResponse<OrganizationDto>>
{
    private readonly IGenericRepository<Company> _companyRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetOrganizationByIdQueryHandler"/> class.
    /// </summary>
    public GetOrganizationByIdQueryHandler(IGenericRepository<Company> companyRepository)
    {
        _companyRepository = companyRepository;
    }

    /// <summary>
    /// Executes retrieval of organization details.
    /// </summary>
    public async Task<ApiResponse<OrganizationDto>> Handle(GetOrganizationByIdQuery request, CancellationToken cancellationToken)
    {
        var company = await _companyRepository.GetByIdAsync(request.Id, cancellationToken);
        if (company == null)
        {
            return ApiResponse<OrganizationDto>.Fail("Organization not found.");
        }

        var dto = new OrganizationDto
        {
            Id = company.Id,
            Name = company.Name,
            Code = company.Code,
            RegistrationNumber = company.RegistrationNumber,
            TaxId = company.TaxId,
            Email = company.Email,
            Phone = company.Phone,
            Website = company.Website,
            LogoUrl = company.LogoUrl,
            Currency = company.Currency,
            IsActive = company.IsActive,
            CreatedAt = company.CreatedAt
        };

        return ApiResponse<OrganizationDto>.Success(dto, "Organization details retrieved successfully.");
    }
}
