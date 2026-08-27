using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.DTOs;

/// <summary>
/// Data transfer object representing a leave type policy.
/// </summary>
public class LeaveTypeDto
{
    public int Id { get; set; }
    public Guid Uuid { get; set; }
    public int CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public decimal AnnualQuota { get; set; }
    public bool RequiresHrApproval { get; set; }
    public bool AllowNegativeBalance { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
