namespace Workora.Application.Features.Shifts.DTOs;

/// <summary>
/// DTO representing an employee's monthly shift roster assignment schedule.
/// </summary>
public class EmployeeRosterDto
{
    /// <summary>
    /// Gets or sets employee ID.
    /// </summary>
    public int EmployeeId { get; set; }

    /// <summary>
    /// Gets or sets employee code.
    /// </summary>
    public string EmployeeCode { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets assigned shift ID.
    /// </summary>
    public int ShiftId { get; set; }

    /// <summary>
    /// Gets or sets assigned shift name (e.g. Morning, Night, General).
    /// </summary>
    public string ShiftName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets effective start date.
    /// </summary>
    public DateOnly EffectiveFrom { get; set; }

    /// <summary>
    /// Gets or sets effective end date.
    /// </summary>
    public DateOnly? EffectiveTo { get; set; }
}
