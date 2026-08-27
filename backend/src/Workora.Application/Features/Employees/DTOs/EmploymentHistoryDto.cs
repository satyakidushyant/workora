using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Employment history transition DTO.
/// </summary>
public class EmploymentHistoryDto
{
    /// <summary>Identifier.</summary>
    public int Id { get; set; }

    /// <summary>Effective transition date.</summary>
    public DateOnly EffectiveDate { get; set; }

    /// <summary>Event type description.</summary>
    public string EventType { get; set; } = string.Empty;

    /// <summary>Previous department ID.</summary>
    public int? PreviousDepartmentId { get; set; }

    /// <summary>New department ID.</summary>
    public int? NewDepartmentId { get; set; }

    /// <summary>Previous designation ID.</summary>
    public int? PreviousDesignationId { get; set; }

    /// <summary>New designation ID.</summary>
    public int? NewDesignationId { get; set; }

    /// <summary>Previous branch ID.</summary>
    public int? PreviousBranchId { get; set; }

    /// <summary>New branch ID.</summary>
    public int? NewBranchId { get; set; }

    /// <summary>Notes on transition.</summary>
    public string? Notes { get; set; }

    /// <summary>Creation timestamp.</summary>
    public DateTimeOffset CreatedAt { get; set; }
}
