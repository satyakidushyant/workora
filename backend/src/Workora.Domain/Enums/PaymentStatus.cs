namespace Workora.Domain.Enums;

/// <summary>
/// Status of an individual payslip payment disbursement.
/// </summary>
public enum PaymentStatus
{
    /// <summary>
    /// Pending bank transfer or check issuance.
    /// </summary>
    Pending = 1,

    /// <summary>
    /// Successfully disbursed to employee.
    /// </summary>
    Paid = 2,

    /// <summary>
    /// Disbursement failure.
    /// </summary>
    Failed = 3
}
