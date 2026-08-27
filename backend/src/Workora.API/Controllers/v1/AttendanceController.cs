using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Attendance.Commands.ApproveAttendanceCorrection;
using Workora.Application.Features.Attendance.Commands.BulkImportAttendance;
using Workora.Application.Features.Attendance.Commands.CheckIn;
using Workora.Application.Features.Attendance.Commands.CheckOut;
using Workora.Application.Features.Attendance.Commands.RejectAttendanceCorrection;
using Workora.Application.Features.Attendance.Commands.RequestAttendanceCorrection;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Application.Features.Attendance.Queries.GetAttendanceCorrectionsList;
using Workora.Application.Features.Attendance.Queries.GetAttendanceHistory;
using Workora.Application.Features.Attendance.Queries.GetAttendanceSummary;
using Workora.Application.Features.Attendance.Queries.GetTodayAttendanceStatus;
using Workora.Application.Features.Attendance.Queries.GetLiveAttendanceStatus;
using Workora.Application.Features.Attendance.Commands.PushBiometricDevicePunches;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for employee check-in/out, attendance history, corrections, and biometric sync.
/// </summary>
[ApiController]
[Route("api/v1/attendance")]
public class AttendanceController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="AttendanceController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public AttendanceController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Registers the current employee's check-in timestamp for today.
    /// </summary>
    /// <param name="command">Optional check-in command parameters.</param>
    /// <returns>The created/updated attendance record.</returns>
    [HttpPost("check-in")]
    [Authorize(Policy = "attendance.self")]
    public async Task<ApiResponse<AttendanceRecordDto>> CheckIn([FromBody] CheckInCommand? command)
        => await _mediator.Send(command ?? new CheckInCommand(null));

    /// <summary>
    /// Registers the current employee's check-out timestamp for today.
    /// </summary>
    /// <param name="command">Optional check-out command parameters.</param>
    /// <returns>The updated attendance record.</returns>
    [HttpPost("check-out")]
    [Authorize(Policy = "attendance.self")]
    public async Task<ApiResponse<AttendanceRecordDto>> CheckOut([FromBody] CheckOutCommand? command)
        => await _mediator.Send(command ?? new CheckOutCommand(null));

    /// <summary>
    /// Gets today's check-in / check-out status for the current employee.
    /// </summary>
    /// <returns>Today's attendance record or null if not yet checked in.</returns>
    [HttpGet("today")]
    [Authorize(Policy = "attendance.self")]
    public async Task<ApiResponse<AttendanceRecordDto?>> GetTodayStatus()
        => await _mediator.Send(new GetTodayAttendanceStatusQuery());

    /// <summary>
    /// Gets the attendance history for a specific employee across a date range.
    /// </summary>
    /// <param name="employeeId">The employee ID.</param>
    /// <param name="startDate">The start date.</param>
    /// <param name="endDate">The end date.</param>
    /// <returns>A list of attendance records.</returns>
    [HttpGet("{employeeId:int}")]
    [Authorize(Policy = "attendance.view")]
    public async Task<ApiResponse<IReadOnlyList<AttendanceRecordDto>>> GetAttendanceHistory(
        int employeeId,
        [FromQuery] DateOnly startDate,
        [FromQuery] DateOnly endDate)
        => await _mediator.Send(new GetAttendanceHistoryQuery(employeeId, startDate, endDate));

    /// <summary>
    /// Gets a monthly attendance aggregation summary for an employee.
    /// </summary>
    /// <param name="employeeId">The employee ID.</param>
    /// <param name="month">The calendar month (1-12).</param>
    /// <param name="year">The calendar year.</param>
    /// <returns>Monthly summary stats.</returns>
    [HttpGet("summary")]
    [Authorize(Policy = "attendance.view")]
    public async Task<ApiResponse<AttendanceSummaryDto>> GetSummary(
        [FromQuery] int employeeId,
        [FromQuery] int month,
        [FromQuery] int year)
        => await _mediator.Send(new GetAttendanceSummaryQuery(employeeId, month, year));

    /// <summary>
    /// Submits a correction request for a specific attendance record.
    /// </summary>
    /// <param name="id">The attendance record ID.</param>
    /// <param name="command">The correction command payload.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPost("{id:int}/correction")]
    [Authorize(Policy = "attendance.self")]
    public async Task<ApiResponse<bool>> RequestCorrection(int id, [FromBody] RequestAttendanceCorrectionCommand command)
        => await _mediator.Send(command with { AttendanceRecordId = id });

    /// <summary>
    /// Gets a paginated list of attendance correction requests for review.
    /// </summary>
    /// <param name="query">Pagination and status filter.</param>
    /// <returns>A paginated list of correction requests.</returns>
    [HttpGet("corrections")]
    [Authorize(Policy = "attendance.view")]
    public async Task<ApiResponse<PagedResponse<AttendanceCorrectionDto>>> GetCorrections([FromQuery] GetAttendanceCorrectionsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Approves an attendance correction request.
    /// </summary>
    /// <param name="id">The correction ID.</param>
    /// <param name="command">Optional approval command.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPatch("corrections/{id:int}/approve")]
    [Authorize(Policy = "attendance.approve")]
    public async Task<ApiResponse<bool>> ApproveCorrection(int id, [FromBody] ApproveAttendanceCorrectionCommand? command)
        => await _mediator.Send((command ?? new ApproveAttendanceCorrectionCommand(id, null)) with { Id = id });

    /// <summary>
    /// Rejects an attendance correction request.
    /// </summary>
    /// <param name="id">The correction ID.</param>
    /// <param name="command">Optional rejection command.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPatch("corrections/{id:int}/reject")]
    [Authorize(Policy = "attendance.approve")]
    public async Task<ApiResponse<bool>> RejectCorrection(int id, [FromBody] RejectAttendanceCorrectionCommand? command)
        => await _mediator.Send((command ?? new RejectAttendanceCorrectionCommand(id, null)) with { Id = id });

    /// <summary>
    /// Bulk imports attendance records from biometric devices or external systems.
    /// </summary>
    /// <param name="command">The batch import command.</param>
    /// <returns>The total number of records processed.</returns>
    [HttpPost("bulk-import")]
    [Authorize(Policy = "attendance.manage")]
    public async Task<ApiResponse<int>> BulkImport([FromBody] BulkImportAttendanceCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Retrieves real-time presence dashboard for active company employees.
    /// </summary>
    /// <param name="companyId">The company ID.</param>
    /// <returns>Real-time attendance metrics.</returns>
    [HttpGet("live-status")]
    [Authorize(Policy = "attendance.view")]
    public async Task<ApiResponse<LiveAttendanceStatusDto>> GetLiveStatus([FromQuery] int companyId)
        => await _mediator.Send(new GetLiveAttendanceStatusQuery(companyId));

    /// <summary>
    /// Pushes biometric device punch logs into the system.
    /// </summary>
    /// <param name="command">The biometric punches payload.</param>
    /// <returns>Number of punches processed.</returns>
    [HttpPost("device-punches")]
    [Authorize(Policy = "attendance.manage")]
    public async Task<ApiResponse<int>> PushDevicePunches([FromBody] PushBiometricDevicePunchesCommand command)
        => await _mediator.Send(command);
}
