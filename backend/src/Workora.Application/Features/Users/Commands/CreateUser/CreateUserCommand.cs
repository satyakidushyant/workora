using MediatR;
using Workora.Application.Features.Users.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Commands.CreateUser;

/// <summary>
/// Command to create a new user account.
/// </summary>
/// <param name="Email">The user's email address.</param>
/// <param name="FirstName">The user's first name.</param>
/// <param name="LastName">The user's last name.</param>
/// <param name="Password">The initial plain-text password for the user.</param>
/// <param name="EmployeeId">Optional linked employee ID.</param>
/// <param name="RoleId">Optional role ID to assign.</param>
public record CreateUserCommand(
    string Email,
    string FirstName,
    string LastName,
    string Password,
    int? EmployeeId = null,
    int? RoleId = null
) : IRequest<ApiResponse<UserDto>>;

