namespace Workora.Domain.Enums;

/// <summary>
/// State of a monthly payroll run cycle.
/// </summary>
public enum PayrollStatus
{
    /// <summary>
    /// Initial draft state.
    /// </summary>
    Draft = 1,

    /// <summary>
    /// Computed and calculated with generated payslips.
    /// </summary>
    Calculated = 2,

    /// <summary>
    /// Approved by finance / management.
    /// </summary>
    Approved = 3,

    /// <summary>
    /// Disbursed and paid to employees.
    /// </summary>
    Disbursed = 4,

    /// <summary>
    /// Cancelled / voided payroll cycle.
    /// </summary>
    Cancelled = 5
}
