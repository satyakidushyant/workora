using MediatR;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Commands.LogoutAll;

/// <summary>
/// Command for logging out a user from all active sessions by revoking all their refresh tokens.
/// </summary>
public record LogoutAllCommand : IRequest<ApiResponse<LogoutResponseDto>>;
