using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Holidays.Commands.CreateHoliday;
using Workora.Application.Features.Holidays.Commands.DeleteHoliday;
using Workora.Application.Features.Holidays.Commands.UpdateHoliday;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Application.Features.Holidays.Queries.GetHolidayById;
using Workora.Application.Features.Holidays.Queries.GetHolidaysList;
using Workora.Application.Features.Holidays.Commands.BulkImportHolidays;
using Workora.Application.Features.Holidays.Queries.GetWeeklyOffPolicy;
using Workora.Application.Features.Holidays.Commands.UpdateWeeklyOffPolicy;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing the company and regional annual holiday calendar.
/// </summary>
[ApiController]
[Route("api/v1/holidays")]
public class HolidaysController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="HolidaysController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public HolidaysController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets the list of holidays for a specific year and optional branch.
    /// </summary>
    /// <param name="year">The calendar year (defaults to current year).</param>
    /// <param name="branchId">Optional branch identifier.</param>
    /// <param name="companyId">Optional company identifier.</param>
    /// <returns>A list of holidays.</returns>
    [HttpGet]
    [Authorize(Policy = "holidays.view")]
    public async Task<ApiResponse<IReadOnlyList<HolidayDto>>> GetHolidays([FromQuery] int year, [FromQuery] int? branchId = null, [FromQuery] int? companyId = null)
        => await _mediator.Send(new GetHolidaysListQuery(year, branchId, companyId));

    /// <summary>
    /// Gets detailed information for a single holiday.
    /// </summary>
    /// <param name="id">The holiday ID.</param>
    /// <returns>The holiday details.</returns>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "holidays.view")]
    public async Task<ApiResponse<HolidayDto>> GetHolidayById(int id)
        => await _mediator.Send(new GetHolidayByIdQuery(id));

    /// <summary>
    /// Creates a new holiday entry.
    /// </summary>
    /// <param name="command">The create holiday command payload.</param>
    /// <returns>The newly created holiday.</returns>
    [HttpPost]
    [Authorize(Policy = "holidays.manage")]
    public async Task<ApiResponse<HolidayDto>> CreateHoliday([FromBody] CreateHolidayCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates an existing holiday entry.
    /// </summary>
    /// <param name="id">The holiday ID.</param>
    /// <param name="command">The update holiday command payload.</param>
    /// <returns>The updated holiday.</returns>
    [HttpPut("{id:int}")]
    [Authorize(Policy = "holidays.manage")]
    public async Task<ApiResponse<HolidayDto>> UpdateHoliday(int id, [FromBody] UpdateHolidayCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Deletes a holiday entry.
    /// </summary>
    /// <param name="id">The holiday ID.</param>
    /// <returns>A confirmation response.</returns>
    [HttpDelete("{id:int}")]
    [Authorize(Policy = "holidays.manage")]
    public async Task<ApiResponse<bool>> DeleteHoliday(int id)
        => await _mediator.Send(new DeleteHolidayCommand(id));

    /// <summary>
    /// Bulk imports annual holiday entries.
    /// </summary>
    /// <param name="command">The bulk import payload.</param>
    /// <returns>Number of imported holidays.</returns>
    [HttpPost("import")]
    [Authorize(Policy = "holidays.manage")]
    public async Task<ApiResponse<int>> BulkImport([FromBody] BulkImportHolidaysCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Gets the weekly-off policy for a company.
    /// </summary>
    /// <param name="companyId">The company ID.</param>
    /// <returns>Weekly off policy details.</returns>
    [HttpGet("/api/v1/weekly-offs")]
    [Authorize(Policy = "settings.view")]
    public async Task<ApiResponse<WeeklyOffPolicyDto>> GetWeeklyOffPolicy([FromQuery] int companyId)
        => await _mediator.Send(new GetWeeklyOffPolicyQuery(companyId));

    /// <summary>
    /// Updates the weekly-off policy for a company.
    /// </summary>
    /// <param name="command">The update policy payload.</param>
    /// <returns>Updated weekly off policy.</returns>
    [HttpPut("/api/v1/weekly-offs")]
    [Authorize(Policy = "settings.manage")]
    public async Task<ApiResponse<WeeklyOffPolicyDto>> UpdateWeeklyOffPolicy([FromBody] UpdateWeeklyOffPolicyCommand command)
        => await _mediator.Send(command);
}
