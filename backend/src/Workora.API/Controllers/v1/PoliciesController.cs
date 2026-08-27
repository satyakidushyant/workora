using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Policies.Commands.AcknowledgePolicy;
using Workora.Application.Features.Policies.Commands.CreatePolicy;
using Workora.Application.Features.Policies.DTOs;
using Workora.Application.Features.Policies.Queries.GetPolicyById;
using Workora.Application.Features.Policies.Queries.GetPoliciesList;
using Workora.Shared.Responses;
using Workora.Application.Features.Policies.Commands.CreatePolicyVersion;
using Workora.Application.Features.Policies.Queries.GetPolicyComplianceReport;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for corporate policies, code of conduct handbooks, and employee compliance acknowledgments.
/// </summary>
[ApiController]
[Route("api/v1/policies")]
public class PoliciesController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="PoliciesController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public PoliciesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a paginated list of corporate policies for a company.
    /// </summary>
    /// <param name="query">Pagination and company filter.</param>
    /// <returns>A paginated list of policies.</returns>
    [HttpGet]
    [Authorize(Policy = "policies.view")]
    public async Task<ApiResponse<PagedResponse<PolicyDto>>> GetPolicies([FromQuery] GetPoliciesListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets details of a specific corporate policy.
    /// </summary>
    /// <param name="id">The policy ID.</param>
    /// <returns>The policy details.</returns>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "policies.view")]
    public async Task<ApiResponse<PolicyDto>> GetPolicyById(int id)
        => await _mediator.Send(new GetPolicyByIdQuery(id));

    /// <summary>
    /// Creates a new corporate policy.
    /// </summary>
    /// <param name="command">The policy creation command payload.</param>
    /// <returns>The created policy.</returns>
    [HttpPost]
    [Authorize(Policy = "policies.manage")]
    public async Task<ApiResponse<PolicyDto>> CreatePolicy([FromBody] CreatePolicyCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Records the authenticated employee's acknowledgment of a corporate policy.
    /// </summary>
    /// <param name="id">The policy ID.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPost("{id:int}/acknowledge")]
    [Authorize(Policy = "policies.view")]
    public async Task<ApiResponse<bool>> AcknowledgePolicy(int id)
        => await _mediator.Send(new AcknowledgePolicyCommand(id));

    /// <summary>
    /// Publishes a new version for an existing policy.
    /// </summary>
    /// <param name="id">The policy ID.</param>
    /// <param name="command">Version creation command payload.</param>
    /// <returns>Updated policy details.</returns>
    [HttpPost("{id:int}/versions")]
    [Authorize(Policy = "policies.manage")]
    public async Task<ApiResponse<PolicyDto>> CreatePolicyVersion(int id, [FromBody] CreatePolicyVersionCommand command)
        => await _mediator.Send(command with { PolicyId = id });

    /// <summary>
    /// Gets policy compliance acknowledgment audit report.
    /// </summary>
    /// <param name="id">The policy ID.</param>
    /// <returns>Compliance audit statistics.</returns>
    [HttpGet("{id:int}/compliance")]
    [Authorize(Policy = "policies.manage")]
    public async Task<ApiResponse<PolicyComplianceAuditDto>> GetComplianceReport(int id)
        => await _mediator.Send(new GetPolicyComplianceReportQuery(id));
}
