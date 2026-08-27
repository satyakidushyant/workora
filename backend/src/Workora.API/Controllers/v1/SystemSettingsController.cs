using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.SystemSettings.Commands.UpdateCompanySettings;
using Workora.Application.Features.SystemSettings.DTOs;
using Workora.Application.Features.SystemSettings.Queries.GetCompanySettings;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for corporate configuration key-value pairs (currency, locale, notifications, payroll parameters).
/// </summary>
[ApiController]
[Route("api/v1/settings")]
public class SystemSettingsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="SystemSettingsController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public SystemSettingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lists all system configuration parameters for a company.
    /// </summary>
    /// <param name="companyId">The company ID.</param>
    /// <param name="group">Optional group category.</param>
    /// <returns>A list of system settings.</returns>
    [HttpGet]
    [Authorize(Policy = "settings.view")]
    public async Task<ApiResponse<IReadOnlyList<SystemSettingDto>>> GetSettings(
        [FromQuery] int companyId,
        [FromQuery] string? group = null)
        => await _mediator.Send(new GetCompanySettingsQuery(companyId, group));

    /// <summary>
    /// Updates batch configuration settings for a company.
    /// </summary>
    /// <param name="command">The settings update command payload.</param>
    /// <returns>The updated list of settings.</returns>
    [HttpPut]
    [Authorize(Policy = "settings.manage")]
    public async Task<ApiResponse<IReadOnlyList<SystemSettingDto>>> UpdateSettings([FromBody] UpdateCompanySettingsCommand command)
        => await _mediator.Send(command);
}
