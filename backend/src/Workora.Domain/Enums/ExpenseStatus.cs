namespace Workora.Domain.Enums;

/// <summary>
/// Defines the approval and disbursement status of an expense claim.
/// </summary>
public enum ExpenseStatus
{
    /// <summary>
    /// Submitted by employee and pending manager review.
    /// </summary>
    Submitted = 1,

    /// <summary>
    /// Approved by reporting manager and pending finance review.
    /// </summary>
    ManagerApproved = 2,

    /// <summary>
    /// Approved by finance team and queued for payroll reimbursement.
    /// </summary>
    FinanceApproved = 3,

    /// <summary>
    /// Reimbursed via payroll disbursement.
    /// </summary>
    Reimbursed = 4,

    /// <summary>
    /// Claim rejected by manager or finance.
    /// </summary>
    Rejected = 5
}
