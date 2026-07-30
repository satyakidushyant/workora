using MediatR;
using Workora.Application.Features.Users.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Commands.UpdateUser;

/// <summary>
/// Command to update an existing user's profile details.
/// </summary>
/// <param name="Id">The ID of the user to update.</param>
/// <param name="FirstName">The updated first name.</param>
/// <param name="LastName">The updated last name.</param>
/// <param name="EmployeeId">Optional updated employee ID.</param>
public record UpdateUserCommand(
    int Id,
    string FirstName,
    string LastName,
    int? EmployeeId = null
) : IRequest<ApiResponse<UserDto>>;
