using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.Commands.CreateSubscriptionPlan;
using Workora.Application.Features.SuperAdmin.Commands.DeleteSubscriptionPlan;
using Workora.Application.Features.SuperAdmin.Commands.ReactivateOrganization;
using Workora.Application.Features.SuperAdmin.Commands.RegisterOrganization;
using Workora.Application.Features.SuperAdmin.Commands.SuspendOrganization;
using Workora.Application.Features.SuperAdmin.Commands.UpdateOrganization;
using Workora.Application.Features.SuperAdmin.Commands.UpdateSubscriptionPlan;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Application.Features.SuperAdmin.Queries.GetOrganizationById;
using Workora.Application.Features.SuperAdmin.Queries.GetOrganizations;
using Workora.Application.Features.SuperAdmin.Queries.GetSubscriptionPlans;
using Workora.Application.Features.SuperAdmin.Queries.GetSuperAdminMetrics;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Handles SaaS platform administration endpoints for plans, tenant organization lifecycle, and global metrics.
/// </summary>
[ApiController]
[Route("api/v1/superadmin")]
[Authorize(Policy = "superadmin.access")]
public class SuperAdminController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="SuperAdminController"/> class.
    /// </summary>
    /// <param name="mediator">The MediatR instance.</param>
    public SuperAdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Retrieves all subscription plans.
    /// </summary>
    [HttpGet("plans")]
    public async Task<ApiResponse<IReadOnlyList<SubscriptionPlanDto>>> GetPlans()
    {
        return await _mediator.Send(new GetSubscriptionPlansQuery());
    }

    /// <summary>
    /// Creates a new subscription plan.
    /// </summary>
    [HttpPost("plans")]
    public async Task<ApiResponse<SubscriptionPlanDto>> CreatePlan([FromBody] CreateSubscriptionPlanCommand command)
    {
        return await _mediator.Send(command);
    }

    /// <summary>
    /// Updates an existing subscription plan.
    /// </summary>
    /// <param name="id">The subscription plan ID.</param>
    /// <param name="command">The update payload.</param>
    /// <returns>The updated subscription plan.</returns>
    [HttpPut("plans/{id:int}")]
    public async Task<ApiResponse<SubscriptionPlanDto>> UpdatePlan(int id, [FromBody] UpdateSubscriptionPlanCommand command)
    {
        return await _mediator.Send(command with { Id = id });
    }

    /// <summary>
    /// Deletes a subscription plan.
    /// </summary>
    /// <param name="id">The subscription plan ID.</param>
    /// <returns>Confirmation of deletion.</returns>
    [HttpDelete("plans/{id:int}")]
    public async Task<ApiResponse<bool>> DeletePlan(int id)
    {
        return await _mediator.Send(new DeleteSubscriptionPlanCommand(id));
    }

    /// <summary>
    /// Retrieves a paginated list of tenant organizations.
    /// </summary>
    [HttpGet("organizations")]
    public async Task<ApiResponse<PagedResponse<OrganizationDto>>> GetOrganizations([FromQuery] GetOrganizationsQuery query)
    {
        return await _mediator.Send(query);
    }

    /// <summary>
    /// Registers a new tenant organization.
    /// </summary>
    /// <param name="command">The registration payload.</param>
    /// <returns>The newly registered organization.</returns>
    [HttpPost("organizations")]
    public async Task<ApiResponse<OrganizationDto>> RegisterOrganization([FromBody] RegisterOrganizationCommand command)
    {
        return await _mediator.Send(command);
    }

    /// <summary>
    /// Retrieves detailed information for a single organization.
    /// </summary>
    /// <param name="id">The organization ID.</param>
    /// <returns>The organization details.</returns>
    [HttpGet("organizations/{id:int}")]
    public async Task<ApiResponse<OrganizationDto>> GetOrganizationById(int id)
    {
        return await _mediator.Send(new GetOrganizationByIdQuery(id));
    }

    /// <summary>
    /// Updates an existing organization profile.
    /// </summary>
    /// <param name="id">The organization ID.</param>
    /// <param name="command">The update payload.</param>
    /// <returns>The updated organization.</returns>
    [HttpPut("organizations/{id:int}")]
    public async Task<ApiResponse<OrganizationDto>> UpdateOrganization(int id, [FromBody] UpdateOrganizationCommand command)
    {
        return await _mediator.Send(command with { Id = id });
    }

    /// <summary>
    /// Suspends a tenant organization.
    /// </summary>
    /// <param name="id">The organization ID.</param>
    /// <returns>Confirmation of suspension.</returns>
    [HttpPatch("organizations/{id:int}/suspend")]
    public async Task<ApiResponse<bool>> SuspendOrganization(int id)
    {
        return await _mediator.Send(new SuspendOrganizationCommand(id));
    }

    /// <summary>
    /// Reactivates a suspended tenant organization.
    /// </summary>
    /// <param name="id">The organization ID.</param>
    /// <returns>Confirmation of reactivation.</returns>
    [HttpPatch("organizations/{id:int}/reactivate")]
    public async Task<ApiResponse<bool>> ReactivateOrganization(int id)
    {
        return await _mediator.Send(new ReactivateOrganizationCommand(id));
    }

    /// <summary>
    /// Retrieves platform global metrics.
    /// </summary>
    [HttpGet("metrics")]
    public async Task<ApiResponse<SuperAdminMetricsDto>> GetMetrics()
    {
        return await _mediator.Send(new GetSuperAdminMetricsQuery());
    }
}
