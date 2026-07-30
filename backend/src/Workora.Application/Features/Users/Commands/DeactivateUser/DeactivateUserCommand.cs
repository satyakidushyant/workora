using MediatR;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Commands.DeactivateUser;

/// <summary>
/// Command to deactivate a user account.
/// </summary>
/// <param name="Id">The ID of the user to deactivate.</param>
public record DeactivateUserCommand(int Id) : IRequest<ApiResponse<bool>>;
