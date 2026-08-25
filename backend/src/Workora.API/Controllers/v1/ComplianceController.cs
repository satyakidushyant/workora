using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Compliance.Commands.DeclareTaxInvestment;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Application.Features.Compliance.Queries.ExportEpfEcr;
using Workora.Application.Features.Compliance.Queries.ExportEsicMonthlyReturn;
using Workora.Application.Features.Compliance.Queries.ExportPtReturn;
using Workora.Application.Features.Compliance.Queries.GetStatutorySummary;
using Workora.Application.Features.Compliance.Queries.GenerateForm16;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for statutory compliance, Indian tax declarations, and government portal export filings (EPF ECR, ESIC, PT).
/// </summary>
[ApiController]
[Route("api/v1/compliance")]
public class ComplianceController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="ComplianceController"/> class.
    /// </summary>
    public ComplianceController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets aggregated statutory deduction summary (PF, ESIC, PT, TDS) for a given month.
    /// </summary>
    [HttpGet("summary")]
    [Authorize(Policy = "compliance.view")]
    public async Task<ApiResponse<StatutorySummaryDto>> GetStatutorySummary([FromQuery] int month, [FromQuery] int year, [FromQuery] int? companyId)
        => await _mediator.Send(new GetStatutorySummaryQuery(month, year, companyId));

    /// <summary>
    /// Generates EPF Unified Portal ECR formatted text file.
    /// </summary>
    [HttpGet("epf/ecr")]
    [Authorize(Policy = "compliance.export")]
    public async Task<ApiResponse<StatutoryExportFileDto>> ExportEpfEcr([FromQuery] int month, [FromQuery] int year, [FromQuery] int? companyId)
        => await _mediator.Send(new ExportEpfEcrQuery(month, year, companyId));

    /// <summary>
    /// Generates ESIC monthly contribution return CSV file.
    /// </summary>
    [HttpGet("esic/monthly-return")]
    [Authorize(Policy = "compliance.export")]
    public async Task<ApiResponse<StatutoryExportFileDto>> ExportEsicReturn([FromQuery] int month, [FromQuery] int year, [FromQuery] int? companyId)
        => await _mediator.Send(new ExportEsicMonthlyReturnQuery(month, year, companyId));

    /// <summary>
    /// Generates State Professional Tax (PT) return CSV file.
    /// </summary>
    [HttpGet("pt/return")]
    [Authorize(Policy = "compliance.export")]
    public async Task<ApiResponse<StatutoryExportFileDto>> ExportPtReturn([FromQuery] int month, [FromQuery] int year, [FromQuery] int? companyId)
        => await _mediator.Send(new ExportPtReturnQuery(month, year, companyId));

    /// <summary>
    /// Submits employee tax investment declarations (80C, 80D, HRA rent paid).
    /// </summary>
    [HttpPost("tax-declaration")]
    [Authorize]
    public async Task<ApiResponse<TaxDeclarationDto>> DeclareTaxInvestment([FromBody] DeclareTaxInvestmentCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Generates Form 16 Part A/B PDF for an employee.
    /// </summary>
    /// <param name="employeeId">The employee ID.</param>
    /// <param name="financialYear">Optional financial year (defaults to current FY).</param>
    /// <returns>Form 16 file details.</returns>
    [HttpGet("tds/form16/{employeeId:int}")]
    [Authorize(Policy = "compliance.view")]
    public async Task<ApiResponse<StatutoryExportFileDto>> GenerateForm16(int employeeId, [FromQuery] string financialYear = "2025-2026")
        => await _mediator.Send(new GenerateForm16Query(employeeId, financialYear));
}
