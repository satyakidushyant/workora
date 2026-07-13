using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Authentication.Commands.ChangePassword;
using Workora.Application.Features.Authentication.Commands.ForgotPassword;
using Workora.Application.Features.Authentication.Commands.Login;
using Workora.Application.Features.Authentication.Commands.Logout;
using Workora.Application.Features.Authentication.Commands.RefreshToken;
using Workora.Application.Features.Authentication.Commands.ResetPassword;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for handling authentication-related endpoints.
/// </summary>
[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="AuthController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Authenticates a user and returns a JWT and refresh token.
    /// </summary>
    /// <param name="command">The login credentials.</param>
    /// <returns>An API response with the authentication result.</returns>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<AuthResultDto>>> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(ApiResponse<AuthResultDto>.Success(result));
    }

    /// <summary>
    /// Refreshes the access token using a valid refresh token.
    /// </summary>
    /// <param name="command">The refresh token command.</param>
    /// <returns>An API response with new tokens.</returns>
    [HttpPost("refresh-token")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<AuthResultDto>>> RefreshToken([FromBody] RefreshTokenCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(ApiResponse<AuthResultDto>.Success(result));
    }

    /// <summary>
    /// Logs out a user by revoking their refresh tokens.
    /// </summary>
    /// <param name="command">The logout command.</param>
    /// <returns>An API response indicating success.</returns>
    [HttpPost("logout")]
    [Authorize(Policy = "auth.logout")]
    public async Task<ActionResult<ApiResponse<LogoutResponseDto>>> Logout([FromBody] LogoutCommand command)
    {
        await _mediator.Send(command);
        var responseDto = new LogoutResponseDto(ResponseMessage.Success.GetDescription());
        return Ok(ApiResponse<LogoutResponseDto>.Success(responseDto));
    }

    /// <summary>
    /// Initiates the forgot password flow by sending a reset email.
    /// </summary>
    /// <param name="command">The forgot password command.</param>
    /// <returns>An API response indicating success.</returns>
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<ForgotPasswordResponseDto>>> ForgotPassword([FromBody] ForgotPasswordCommand command)
    {
        await _mediator.Send(command);
        var responseDto = new ForgotPasswordResponseDto(ResponseMessage.Success.GetDescription());
        return Ok(ApiResponse<ForgotPasswordResponseDto>.Success(responseDto));
    }

    /// <summary>
    /// Resets a user's password using a valid reset token.
    /// </summary>
    /// <param name="command">The reset password command.</param>
    /// <returns>An API response indicating success.</returns>
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<ResetPasswordResponseDto>>> ResetPassword([FromBody] ResetPasswordCommand command)
    {
        await _mediator.Send(command);
        var responseDto = new ResetPasswordResponseDto(ResponseMessage.Success.GetDescription());
        return Ok(ApiResponse<ResetPasswordResponseDto>.Success(responseDto));
    }

    /// <summary>
    /// Allows an authenticated user to change their password.
    /// </summary>
    /// <param name="command">The change password command.</param>
    /// <returns>An API response indicating success.</returns>
    [HttpPost("change-password")]
    [Authorize(Policy = "auth.change-password")]
    public async Task<ActionResult<ApiResponse<ChangePasswordResponseDto>>> ChangePassword([FromBody] ChangePasswordCommand command)
    {
        await _mediator.Send(command);
        var responseDto = new ChangePasswordResponseDto(ResponseMessage.Success.GetDescription());
        return Ok(ApiResponse<ChangePasswordResponseDto>.Success(responseDto));
    }
}
