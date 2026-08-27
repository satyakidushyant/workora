using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Reports.DTOs;
using Workora.Application.Features.Reports.Queries.GetAttendanceReport;
using Workora.Application.Features.Reports.Queries.GetHeadcountReport;
using Workora.Application.Features.Reports.Queries.GetLeaveReport;
using Workora.Application.Features.Reports.Queries.GetPayrollReport;
using Workora.Shared.Responses;
using Workora.Application.Features.Reports.Queries.GetAttritionReport;
using Workora.Application.Features.Reports.Commands.ExportCustomReport;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for corporate reporting, headcount trends, leave utilization, and payroll expense analytics.
/// </summary>
[ApiController]
[Route("api/v1/reports")]
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="ReportsController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public ReportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Generates headcount growth, retention, and turnover metrics.
    /// </summary>
    /// <param name="companyId">The optional company ID.</param>
    /// <returns>Headcount analytics.</returns>
    [HttpGet("headcount")]
    [Authorize(Policy = "reports.view")]
    public async Task<ApiResponse<HeadcountReportDto>> GetHeadcountReport([FromQuery] int? companyId = null)
        => await _mediator.Send(new GetHeadcountReportQuery(companyId));

    /// <summary>
    /// Generates attendance and punctuality analytics.
    /// </summary>
    /// <param name="companyId">The optional company ID.</param>
    /// <returns>Attendance analytics.</returns>
    [HttpGet("attendance")]
    [Authorize(Policy = "reports.view")]
    public async Task<ApiResponse<AttendanceReportDto>> GetAttendanceReport([FromQuery] int? companyId = null)
        => await _mediator.Send(new GetAttendanceReportQuery(companyId));

    /// <summary>
    /// Generates leave type utilization breakdown analytics.
    /// </summary>
    /// <param name="companyId">The optional company ID.</param>
    /// <param name="year">Optional calendar year.</param>
    /// <returns>Leave utilization statistics.</returns>
    [HttpGet("leave")]
    [Authorize(Policy = "reports.view")]
    public async Task<ApiResponse<LeaveReportDto>> GetLeaveReport(
        [FromQuery] int? companyId = null,
        [FromQuery] int? year = null)
        => await _mediator.Send(new GetLeaveReportQuery(companyId, year));

    /// <summary>
    /// Generates payroll expenditure history trends.
    /// </summary>
    /// <param name="companyId">The optional company ID.</param>
    /// <returns>Payroll analytics.</returns>
    [HttpGet("payroll")]
    [Authorize(Policy = "reports.view")]
    public async Task<ApiResponse<PayrollReportDto>> GetPayrollReport([FromQuery] int? companyId = null)
        => await _mediator.Send(new GetPayrollReportQuery(companyId));

    /// <summary>
    /// Generates attrition and turnover rate metrics.
    /// </summary>
    /// <param name="companyId">Optional company ID.</param>
    /// <param name="year">Calendar year filter (defaults to current year).</param>
    /// <returns>Attrition report metrics.</returns>
    [HttpGet("attrition")]
    [Authorize(Policy = "reports.view")]
    public async Task<ApiResponse<AttritionReportDto>> GetAttritionReport([FromQuery] int? companyId = null, [FromQuery] int year = 0)
        => await _mediator.Send(new GetAttritionReportQuery(companyId, year == 0 ? DateTime.UtcNow.Year : year));

    /// <summary>
    /// Generates a custom dynamic Excel report export.
    /// </summary>
    /// <param name="command">Custom export request payload.</param>
    /// <returns>Export file metadata.</returns>
    [HttpPost("custom/export")]
    [Authorize(Policy = "reports.export")]
    public async Task<ApiResponse<CustomReportExportDto>> ExportCustomReport([FromBody] ExportCustomReportCommand command)
        => await _mediator.Send(command);
}
