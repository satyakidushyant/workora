using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Common.Models;
using Workora.Application.Features.Payroll.Payheads;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing salary payheads and earning/deduction components.
/// </summary>
[ApiController]
[Route("api/v1/payheads")]
public class PayheadsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="PayheadsController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public PayheadsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Retrieves list of salary payheads.
    /// </summary>
    /// <param name="companyId">Optional company filter.</param>
    /// <returns>List of payhead components.</returns>
    [HttpGet]
    [Authorize(Policy = "salary.view")]
    public async Task<ApiResponse<IReadOnlyList<PayheadDto>>> GetPayheads([FromQuery] int? companyId = null)
        => await _mediator.Send(new GetPayheadsListQuery(companyId));

    /// <summary>
    /// Creates a new salary payhead / component.
    /// </summary>
    /// <param name="command">Payhead creation payload.</param>
    /// <returns>Created payhead component.</returns>
    [HttpPost]
    [Authorize(Policy = "salary.manage")]
    public async Task<ApiResponse<PayheadDto>> CreatePayhead([FromBody] CreatePayheadCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates an existing salary payhead / component.
    /// </summary>
    /// <param name="id">The payhead ID.</param>
    /// <param name="command">Payhead update payload.</param>
    /// <returns>Updated payhead component.</returns>
    [HttpPut("{id:int}")]
    [Authorize(Policy = "salary.manage")]
    public async Task<ApiResponse<PayheadDto>> UpdatePayhead(int id, [FromBody] UpdatePayheadCommand command)
        => await _mediator.Send(command with { Id = id });
}
