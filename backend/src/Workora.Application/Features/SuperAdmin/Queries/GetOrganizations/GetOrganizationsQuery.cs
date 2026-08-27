using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.SuperAdmin.Queries.GetOrganizations;

/// <summary>
/// Query to retrieve paginated list of tenant organizations for SuperAdmin.
/// </summary>
public record GetOrganizationsQuery(int PageNumber = 1, int PageSize = 10) : IRequest<ApiResponse<PagedResponse<OrganizationDto>>>;
