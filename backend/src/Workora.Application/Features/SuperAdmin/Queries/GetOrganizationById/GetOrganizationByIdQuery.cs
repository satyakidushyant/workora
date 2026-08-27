using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Queries.GetOrganizationById;

/// <summary>
/// Query to retrieve details for a specific organization.
/// </summary>
public record GetOrganizationByIdQuery(int Id) : IRequest<ApiResponse<OrganizationDto>>;
