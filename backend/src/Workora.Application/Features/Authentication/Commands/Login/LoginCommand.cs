using MediatR;
using Workora.Application.Features.Authentication.DTOs;

namespace Workora.Application.Features.Authentication.Commands.Login;

/// <summary>
/// Command for authenticating a user.
/// </summary>
public record LoginCommand(string Email, string Password) : IRequest<AuthResultDto>;
