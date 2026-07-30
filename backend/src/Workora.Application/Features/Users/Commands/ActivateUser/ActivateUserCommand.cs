using MediatR;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Commands.ActivateUser;

/// <summary>
/// Command to reactivate a previously deactivated user account.
/// </summary>
/// <param name="Id">The ID of the user to reactivate.</param>
public record ActivateUserCommand(int Id) : IRequest<ApiResponse<bool>>;
