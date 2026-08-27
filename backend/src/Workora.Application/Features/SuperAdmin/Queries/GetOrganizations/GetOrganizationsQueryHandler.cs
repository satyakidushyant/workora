using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.SuperAdmin.Queries.GetOrganizations;

/// <summary>
/// Handler for <see cref="GetOrganizationsQuery"/>.
/// </summary>
public class GetOrganizationsQueryHandler : IRequestHandler<GetOrganizationsQuery, ApiResponse<PagedResponse<OrganizationDto>>>
{
    private readonly IGenericRepository<Company> _companyRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetOrganizationsQueryHandler"/> class.
    /// </summary>
    public GetOrganizationsQueryHandler(IGenericRepository<Company> companyRepository)
    {
        _companyRepository = companyRepository;
    }

    /// <summary>
    /// Handles fetching tenant organizations.
    /// </summary>
    public Task<ApiResponse<PagedResponse<OrganizationDto>>> Handle(GetOrganizationsQuery request, CancellationToken cancellationToken)
    {
        var all = _companyRepository.GetQueryable().ToList();
        var totalCount = all.Count;

        var items = all
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(c => new OrganizationDto
            {
                Id = c.Id,
                Name = c.Name,
                Code = c.Code,
                TaxId = c.TaxId,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt
            })
            .ToList();

        var paged = new PagedResponse<OrganizationDto>(items, totalCount, request.PageNumber, request.PageSize);
        return Task.FromResult(ApiResponse<PagedResponse<OrganizationDto>>.Success(paged, "Organizations retrieved successfully."));
    }
}
