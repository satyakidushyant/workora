using MediatR;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Commands.Login;

/// <summary>
/// Command for authenticating a user.
/// </summary>
/// <param name="Email">The user's email address.</param>
/// <param name="Password">The user's password.</param>
public record LoginCommand(string Email, string Password) : IRequest<ApiResponse<AuthResultDto>>;
