using MediatR;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Commands.DeleteUser;

/// <summary>
/// Command to hard-delete a user account.
/// </summary>
/// <param name="Id">The ID of the user to delete.</param>
public record DeleteUserCommand(int Id) : IRequest<ApiResponse<bool>>;
