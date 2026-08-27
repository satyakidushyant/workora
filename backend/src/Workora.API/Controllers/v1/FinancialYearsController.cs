using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.FinancialYears.Commands.CloseFinancialYear;
using Workora.Application.Features.FinancialYears.Commands.CreateFinancialYear;
using Workora.Application.Features.FinancialYears.DTOs;
using Workora.Application.Features.FinancialYears.Queries.GetFinancialYearsList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing financial year configurations.
/// </summary>
[ApiController]
[Route("api/v1/financial-years")]
public class FinancialYearsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="FinancialYearsController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public FinancialYearsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lists all financial years for the company.
    /// </summary>
    /// <returns>A list of financial years.</returns>
    [HttpGet]
    [Authorize(Policy = "settings.view")]
    public async Task<ApiResponse<IReadOnlyList<FinancialYearDto>>> GetFinancialYears()
        => await _mediator.Send(new GetFinancialYearsListQuery());

    /// <summary>
    /// Creates a new financial year.
    /// </summary>
    /// <param name="command">The financial year details.</param>
    /// <returns>The created financial year.</returns>
    [HttpPost]
    [Authorize(Policy = "settings.manage")]
    public async Task<ApiResponse<FinancialYearDto>> CreateFinancialYear([FromBody] CreateFinancialYearCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Closes a financial year, preventing further edits.
    /// </summary>
    /// <param name="id">The financial year ID.</param>
    /// <returns>The updated financial year.</returns>
    [HttpPatch("{id:int}/close")]
    [Authorize(Policy = "settings.manage")]
    public async Task<ApiResponse<FinancialYearDto>> CloseFinancialYear(int id)
        => await _mediator.Send(new CloseFinancialYearCommand(id));
}
