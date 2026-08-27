using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Onboarding.Commands.CreateOnboardingChecklist;
using Workora.Application.Features.Onboarding.Commands.VerifyOnboardingItem;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Application.Features.Onboarding.Queries.GetEmployeeOnboardingState;
using Workora.Application.Features.Onboarding.Queries.GetOnboardingChecklists;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing onboarding checklists and employee onboarding status.
/// </summary>
[ApiController]
[Route("api/v1/onboarding")]
public class OnboardingController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="OnboardingController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public OnboardingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lists all onboarding checklists for the company.
    /// </summary>
    /// <returns>A list of onboarding checklists.</returns>
    [HttpGet("checklists")]
    [Authorize(Policy = "onboarding.view")]
    public async Task<ApiResponse<IReadOnlyList<OnboardingChecklistDto>>> GetChecklists()
        => await _mediator.Send(new GetOnboardingChecklistsQuery());

    /// <summary>
    /// Creates a new onboarding checklist item.
    /// </summary>
    /// <param name="command">The checklist details.</param>
    /// <returns>The created checklist item.</returns>
    [HttpPost("checklists")]
    [Authorize(Policy = "onboarding.manage")]
    public async Task<ApiResponse<OnboardingChecklistDto>> CreateChecklist([FromBody] CreateOnboardingChecklistCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Gets the onboarding status for a specific employee.
    /// </summary>
    /// <param name="id">The employee ID.</param>
    /// <returns>The employee's onboarding state.</returns>
    [HttpGet("employee/{id:int}")]
    [Authorize(Policy = "onboarding.view")]
    public async Task<ApiResponse<EmployeeOnboardingStateDto>> GetEmployeeOnboardingState(int id)
        => await _mediator.Send(new GetEmployeeOnboardingStateQuery(id));

    /// <summary>
    /// Verifies an onboarding item for an employee.
    /// </summary>
    /// <param name="command">The verify payload.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPatch("verify-item")]
    [Authorize(Policy = "onboarding.manage")]
    public async Task<ApiResponse<bool>> VerifyItem([FromBody] VerifyOnboardingItemCommand command)
        => await _mediator.Send(command);
}