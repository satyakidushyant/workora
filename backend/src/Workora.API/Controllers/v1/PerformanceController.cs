using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Performance.Commands.CreateAppraisal;
using Workora.Application.Features.Performance.Commands.CreateGoal;
using Workora.Application.Features.Performance.Commands.FinalizeAppraisal;
using Workora.Application.Features.Performance.Commands.SubmitManagerReview;
using Workora.Application.Features.Performance.Commands.SubmitSelfReview;
using Workora.Application.Features.Performance.Commands.UpdateGoalProgress;
using Workora.Application.Features.Performance.DTOs;
using Workora.Application.Features.Performance.Queries.GetAppraisalById;
using Workora.Application.Features.Performance.Queries.GetAppraisalsList;
using Workora.Application.Features.Performance.Queries.GetEmployeeGoals;
using Workora.Domain.Enums;
using Workora.Shared.Responses;
using Workora.Application.Features.Performance.Queries.GetPerformanceCycles;
using Workora.Application.Features.Performance.Commands.CreatePerformanceCycle;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for employee performance appraisals, self-reviews, manager evaluations, and KPI goal tracking.
/// </summary>
[ApiController]
[Route("api/v1/performance")]
public class PerformanceController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="PerformanceController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public PerformanceController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a paginated list of appraisal review cycles.
    /// </summary>
    /// <param name="query">Filter parameters.</param>
    /// <returns>A paginated list of appraisals.</returns>
    [HttpGet("appraisals")]
    [Authorize(Policy = "performance.view")]
    public async Task<ApiResponse<PagedResponse<AppraisalDto>>> GetAppraisals([FromQuery] GetAppraisalsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets details of a specific appraisal review.
    /// </summary>
    /// <param name="id">The appraisal ID.</param>
    /// <returns>The appraisal review record.</returns>
    [HttpGet("appraisals/{id:int}")]
    [Authorize(Policy = "performance.view")]
    public async Task<ApiResponse<AppraisalDto>> GetAppraisalById(int id)
        => await _mediator.Send(new GetAppraisalByIdQuery(id));

    /// <summary>
    /// Initiates a new performance appraisal cycle for an employee.
    /// </summary>
    /// <param name="command">The creation command payload.</param>
    /// <returns>The initiated appraisal cycle.</returns>
    [HttpPost("appraisals")]
    [Authorize(Policy = "performance.manage")]
    public async Task<ApiResponse<AppraisalDto>> CreateAppraisal([FromBody] CreateAppraisalCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Submits an employee's self-review assessment.
    /// </summary>
    /// <param name="id">The appraisal ID.</param>
    /// <param name="command">The self-review command payload.</param>
    /// <returns>The updated appraisal.</returns>
    [HttpPut("appraisals/{id:int}/self-review")]
    [Authorize(Policy = "performance.self")]
    public async Task<ApiResponse<AppraisalDto>> SubmitSelfReview(int id, [FromBody] SubmitSelfReviewCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Submits a manager's performance evaluation.
    /// </summary>
    /// <param name="id">The appraisal ID.</param>
    /// <param name="command">The manager review command payload.</param>
    /// <returns>The updated appraisal.</returns>
    [HttpPut("appraisals/{id:int}/manager-review")]
    [Authorize(Policy = "performance.manage")]
    public async Task<ApiResponse<AppraisalDto>> SubmitManagerReview(int id, [FromBody] SubmitManagerReviewCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Finalizes an appraisal review with composite score.
    /// </summary>
    /// <param name="id">The appraisal ID.</param>
    /// <param name="command">The final score command payload.</param>
    /// <returns>The finalized appraisal.</returns>
    [HttpPost("appraisals/{id:int}/finalize")]
    [Authorize(Policy = "performance.manage")]
    public async Task<ApiResponse<AppraisalDto>> FinalizeAppraisal(int id, [FromBody] FinalizeAppraisalCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Creates a performance goal / KPI for an employee.
    /// </summary>
    /// <param name="command">The goal command payload.</param>
    /// <returns>The created goal.</returns>
    [HttpPost("goals")]
    [Authorize(Policy = "performance.self")]
    public async Task<ApiResponse<GoalDto>> CreateGoal([FromBody] CreateGoalCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Gets all goals for an employee.
    /// </summary>
    /// <param name="employeeId">The employee ID.</param>
    /// <param name="status">Optional status filter.</param>
    /// <returns>A list of goals.</returns>
    [HttpGet("goals")]
    [Authorize(Policy = "performance.view")]
    public async Task<ApiResponse<IReadOnlyList<GoalDto>>> GetGoals(
        [FromQuery] int employeeId,
        [FromQuery] GoalStatus? status = null)
        => await _mediator.Send(new GetEmployeeGoalsQuery(employeeId, status));

    /// <summary>
    /// Updates the completion progress and status of a goal.
    /// </summary>
    /// <param name="id">The goal ID.</param>
    /// <param name="command">The progress command payload.</param>
    /// <returns>The updated goal.</returns>
    [HttpPut("goals/{id:int}/progress")]
    [Authorize(Policy = "performance.self")]
    public async Task<ApiResponse<GoalDto>> UpdateGoalProgress(int id, [FromBody] UpdateGoalProgressCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Retrieves performance appraisal cycles for a company.
    /// </summary>
    /// <param name="companyId">Company identifier.</param>
    /// <returns>List of performance appraisal review cycles.</returns>
    [HttpGet("cycles")]
    [Authorize(Policy = "performance.view")]
    public async Task<ApiResponse<IReadOnlyList<PerformanceCycleDto>>> GetCycles([FromQuery] int companyId)
        => await _mediator.Send(new GetPerformanceCyclesQuery(companyId));

    /// <summary>
    /// Creates a new performance appraisal review cycle.
    /// </summary>
    /// <param name="command">Creation command payload.</param>
    /// <returns>Created performance review cycle details.</returns>
    [HttpPost("cycles")]
    [Authorize(Policy = "performance.manage")]
    public async Task<ApiResponse<PerformanceCycleDto>> CreateCycle([FromBody] CreatePerformanceCycleCommand command)
        => await _mediator.Send(command);
}
