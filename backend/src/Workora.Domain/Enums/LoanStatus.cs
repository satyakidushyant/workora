namespace Workora.Domain.Enums;

/// <summary>
/// Defines the lifecycle status of a loan or salary advance.
/// </summary>
public enum LoanStatus
{
    /// <summary>
    /// Loan request submitted by employee and pending approval.
    /// </summary>
    PendingApproval = 1,

    /// <summary>
    /// Loan approved and actively undergoing EMI repayment.
    /// </summary>
    Active = 2,

    /// <summary>
    /// All EMIs paid and loan fully settled.
    /// </summary>
    Closed = 3,

    /// <summary>
    /// Loan request rejected by HR or Finance.
    /// </summary>
    Rejected = 4
}
