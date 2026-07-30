using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Users.Commands.ActivateUser;
using Workora.Application.Features.Users.Commands.AdminResetPassword;
using Workora.Application.Features.Users.Commands.AssignUserRoles;
using Workora.Application.Features.Users.Commands.CreateUser;
using Workora.Application.Features.Users.Commands.DeactivateUser;
using Workora.Application.Features.Users.Commands.DeleteUser;
using Workora.Application.Features.Users.Commands.UpdateUser;
using Workora.Application.Features.Users.DTOs;
using Workora.Application.Features.Users.Queries.GetMyAccount;
using Workora.Application.Features.Users.Queries.GetUserById;
using Workora.Application.Features.Users.Queries.GetUsersList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing system user accounts.
/// </summary>
[ApiController]
[Route("api/v1/users")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="UsersController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lists system users with pagination and optional filtering.
    /// </summary>
    /// <param name="query">The query parameters.</param>
    /// <returns>A paginated list of users.</returns>
    [HttpGet]
    [Authorize(Policy = "users.view")]
    public async Task<ApiResponse<PagedResponse<UserDto>>> GetUsers([FromQuery] GetUsersListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets the current authenticated user's own account profile.
    /// </summary>
    /// <returns>The user's account details.</returns>
    [HttpGet("me")]
    [Authorize(Policy = "auth.me")]
    public async Task<ApiResponse<UserDetailDto>> GetMyAccount()
        => await _mediator.Send(new GetMyAccountQuery());

    /// <summary>
    /// Gets detailed information for a single user by ID.
    /// </summary>
    /// <param name="id">The unique identifier of the user.</param>
    /// <returns>The user detail DTO.</returns>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "users.view")]
    public async Task<ApiResponse<UserDetailDto>> GetUserById(int id)
        => await _mediator.Send(new GetUserByIdQuery(id));

    /// <summary>
    /// Creates a new user account.
    /// </summary>
    /// <param name="command">The user creation parameters.</param>
    /// <returns>The newly created user summary.</returns>
    [HttpPost]
    [Authorize(Policy = "users.create")]
    public async Task<ApiResponse<UserDto>> CreateUser([FromBody] CreateUserCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates profile details for an existing user account.
    /// </summary>
    /// <param name="id">The user ID.</param>
    /// <param name="dto">The update request parameters.</param>
    /// <returns>The updated user summary.</returns>
    [HttpPut("{id:int}")]
    [Authorize(Policy = "users.update")]
    public async Task<ApiResponse<UserDto>> UpdateUser(int id, [FromBody] UpdateUserRequestDto dto)
        => await _mediator.Send(new UpdateUserCommand(id, dto.FirstName, dto.LastName, dto.EmployeeId));

    /// <summary>
    /// Deactivates a user account.
    /// </summary>
    /// <param name="id">The user ID.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPatch("{id:int}/deactivate")]
    [Authorize(Policy = "users.deactivate")]
    public async Task<ApiResponse<bool>> DeactivateUser(int id)
        => await _mediator.Send(new DeactivateUserCommand(id));

    /// <summary>
    /// Reactivates a previously deactivated user account.
    /// </summary>
    /// <param name="id">The user ID.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPatch("{id:int}/activate")]
    [Authorize(Policy = "users.deactivate")]
    public async Task<ApiResponse<bool>> ActivateUser(int id)
        => await _mediator.Send(new ActivateUserCommand(id));

    /// <summary>
    /// Assigns roles to a user account.
    /// </summary>
    /// <param name="id">The target user ID.</param>
    /// <param name="dto">The role assignment parameters.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPost("{id:int}/roles")]
    [Authorize(Policy = "users.assign-roles")]
    public async Task<ApiResponse<bool>> AssignRoles(int id, [FromBody] AssignRolesDto dto)
        => await _mediator.Send(new AssignUserRolesCommand(id, dto.RoleIds));

    /// <summary>
    /// Hard-deletes a user account.
    /// </summary>
    /// <param name="id">The user ID.</param>
    /// <returns>A confirmation response.</returns>
    [HttpDelete("{id:int}")]
    [Authorize(Policy = "users.delete")]
    public async Task<ApiResponse<bool>> DeleteUser(int id)
        => await _mediator.Send(new DeleteUserCommand(id));

    /// <summary>
    /// Resets a user's password (triggered by an administrator).
    /// </summary>
    /// <param name="id">The user ID.</param>
    /// <param name="dto">The password reset request parameters.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPost("{id:int}/reset-password")]
    [Authorize(Policy = "users.manage")]
    public async Task<ApiResponse<bool>> AdminResetPassword(int id, [FromBody] AdminResetPasswordRequestDto dto)
        => await _mediator.Send(new AdminResetPasswordCommand(id, dto.NewPassword));
}
