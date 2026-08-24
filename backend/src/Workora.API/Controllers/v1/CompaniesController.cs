using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Companies.Commands.UpdateCompanyProfile;
using Workora.Application.Features.Companies.Commands.UploadCompanyLogo;
using Workora.Application.Features.Companies.DTOs;
using Workora.Application.Features.Companies.Queries.GetCompaniesList;
using Workora.Application.Features.Companies.Queries.GetCompanyProfile;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing company profiles and corporate details.
/// </summary>
[ApiController]
[Route("api/v1")]
public class CompaniesController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="CompaniesController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public CompaniesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets the primary or default company profile.
    /// </summary>
    /// <returns>The company profile details.</returns>
    [HttpGet("company")]
    [Authorize(Policy = "company.view")]
    public async Task<ApiResponse<CompanyDto>> GetCompanyProfile([FromQuery] int? id = null)
        => await _mediator.Send(new GetCompanyProfileQuery(id));

    /// <summary>
    /// Updates the company profile information.
    /// </summary>
    /// <param name="command">The company profile update command payload.</param>
    /// <param name="id">Optional company ID.</param>
    /// <returns>The updated company profile.</returns>
    [HttpPut("company")]
    [Authorize(Policy = "company.manage")]
    public async Task<ApiResponse<CompanyDto>> UpdateCompanyProfile([FromBody] UpdateCompanyProfileCommand command, [FromQuery] int? id = null)
        => await _mediator.Send(id.HasValue ? command with { CompanyId = id } : command);

    /// <summary>
    /// Updates or uploads the company logo.
    /// </summary>
    /// <param name="command">The logo upload command payload.</param>
    /// <param name="id">Optional company ID.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPost("company/logo")]
    [Authorize(Policy = "company.manage")]
    public async Task<ApiResponse<bool>> UploadCompanyLogo([FromBody] UploadCompanyLogoCommand command, [FromQuery] int? id = null)
        => await _mediator.Send(id.HasValue ? command with { CompanyId = id } : command);

    /// <summary>
    /// Lists all companies visible to the user (multi-tenant SuperAdmin accounts).
    /// </summary>
    /// <returns>A list of company summaries.</returns>
    [HttpGet("companies")]
    [Authorize(Policy = "company.view")]
    public async Task<ApiResponse<IReadOnlyList<CompanyDto>>> GetCompaniesList()
        => await _mediator.Send(new GetCompaniesListQuery());
}
