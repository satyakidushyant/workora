using System.Collections.Generic;
using MediatR;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Queries.ListMySessions;

/// <summary>
/// Query for retrieving the active sessions/devices for the current user.
/// </summary>
public record ListMySessionsQuery : IRequest<ApiResponse<IReadOnlyList<UserSessionDto>>>;
