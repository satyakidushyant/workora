using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Attendance.DTOs;

/// <summary>
/// DTO representing real-time live attendance metrics for dashboard.
/// </summary>
public class LiveAttendanceStatusDto
{
    /// <summary>
    /// Gets or sets count of present employees.
    /// </summary>
    public int PresentCount { get; set; }

    /// <summary>
    /// Gets or sets count of absent employees.
    /// </summary>
    public int AbsentCount { get; set; }

    /// <summary>
    /// Gets or sets count of late arriving employees.
    /// </summary>
    public int LateCount { get; set; }

    /// <summary>
    /// Gets or sets count of employees on approved leave.
    /// </summary>
    public int OnLeaveCount { get; set; }

    /// <summary>
    /// Gets or sets total active headcount.
    /// </summary>
    public int TotalHeadcount { get; set; }
}
