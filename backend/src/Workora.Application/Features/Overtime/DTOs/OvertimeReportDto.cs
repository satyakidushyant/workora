using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.DTOs;

/// <summary>
/// Data transfer object for overtime report summary.
/// </summary>
public class OvertimeReportDto
{
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string EmployeeCode { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public decimal TotalOvertimeHours { get; set; }
    public int TotalOvertimeDays { get; set; }
    public List<OvertimeRequestDto> OvertimeRequests { get; set; } = new();
}
