using AutoMapper;
using MediatR;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.Queries.GetOvertimeReport;

/// <summary>
/// Query to retrieve an overtime report for a specific employee within a date range.
/// </summary>
public record GetOvertimeReportQuery(
    int EmployeeId,
    DateOnly FromDate,
    DateOnly ToDate) : IRequest<ApiResponse<OvertimeReportDto>>;
