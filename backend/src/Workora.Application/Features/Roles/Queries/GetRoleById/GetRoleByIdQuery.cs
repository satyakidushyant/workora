using MediatR;
using Workora.Application.Features.Roles.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Roles.Queries.GetRoleById;

/// <summary>
/// Query to retrieve detailed role information including assigned permissions by ID.
/// </summary>
/// <param name="Id">The role ID.</param>
public record GetRoleByIdQuery(int Id) : IRequest<ApiResponse<RoleDetailDto>>;
