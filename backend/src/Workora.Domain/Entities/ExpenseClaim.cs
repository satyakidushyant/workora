using Workora.Domain.Common;
using Workora.Domain.Enums;
using Workora.Domain.Exceptions;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an employee reimbursement claim for official business expenses.
/// </summary>
public class ExpenseClaim : AuditableEntity
{
    /// <summary>
    /// The employee submitting the claim.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Gets the navigation property for the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// The category of expense (Travel, Lodging, Meals, etc.).
    /// </summary>
    public ExpenseCategory Category { get; private set; }

    /// <summary>
    /// Date when the expense was incurred.
    /// </summary>
    public DateOnly ExpenseDate { get; private set; }

    /// <summary>
    /// Claimed currency amount.
    /// </summary>
    public decimal Amount { get; private set; }

    /// <summary>
    /// Name of merchant, vendor, or establishment.
    /// </summary>
    public string? MerchantName { get; private set; }

    /// <summary>
    /// Business description/justification.
    /// </summary>
    public string Description { get; private set; } = string.Empty;

    /// <summary>
    /// URL or storage path to the uploaded receipt/bill document.
    /// </summary>
    public string ReceiptUrl { get; private set; } = string.Empty;

    /// <summary>
    /// Current approval status.
    /// </summary>
    public ExpenseStatus Status { get; private set; }

    /// <summary>
    /// User ID of reporting manager who approved.
    /// </summary>
    public int? ManagerApprovedByUserId { get; private set; }

    /// <summary>
    /// Timestamp of manager approval.
    /// </summary>
    public DateTimeOffset? ManagerApprovedAt { get; private set; }

    /// <summary>
    /// User ID of finance officer who approved for reimbursement.
    /// </summary>
    public int? FinanceApprovedByUserId { get; private set; }

    /// <summary>
    /// Timestamp of finance approval.
    /// </summary>
    public DateTimeOffset? FinanceApprovedAt { get; private set; }

    /// <summary>
    /// Reason provided if claim was rejected.
    /// </summary>
    public string? RejectionReason { get; private set; }

    /// <summary>
    /// Foreign key to the payroll run in which reimbursement was disbursed.
    /// </summary>
    public int? PayrollRunId { get; private set; }

    private ExpenseClaim() { } // EF Core

    /// <summary>
    /// Factory method to submit a new expense claim.
    /// </summary>
    public static ExpenseClaim Create(
        int employeeId,
        ExpenseCategory category,
        DateOnly expenseDate,
        decimal amount,
        string? merchantName,
        string description,
        string receiptUrl)
    {
        if (amount <= 0)
            throw new DomainException("Expense amount must be greater than zero.");

        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException("Expense description is required.");

        return new ExpenseClaim
        {
            EmployeeId = employeeId,
            Category = category,
            ExpenseDate = expenseDate,
            Amount = amount,
            MerchantName = merchantName,
            Description = description,
            ReceiptUrl = receiptUrl,
            Status = ExpenseStatus.Submitted
        };
    }

    /// <summary>
    /// Manager approves the expense claim.
    /// </summary>
    public void ApproveByManager(int managerUserId)
    {
        if (Status != ExpenseStatus.Submitted)
            throw new DomainException($"Cannot approve an expense in {Status} status.");

        Status = ExpenseStatus.ManagerApproved;
        ManagerApprovedByUserId = managerUserId;
        ManagerApprovedAt = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Finance approves the expense claim for reimbursement.
    /// </summary>
    public void ApproveByFinance(int financeUserId)
    {
        if (Status != ExpenseStatus.ManagerApproved && Status != ExpenseStatus.Submitted)
            throw new DomainException($"Cannot approve an expense in {Status} status.");

        Status = ExpenseStatus.FinanceApproved;
        FinanceApprovedByUserId = financeUserId;
        FinanceApprovedAt = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Rejects the expense claim.
    /// </summary>
    public void Reject(int reviewerUserId, string reason)
    {
        if (Status == ExpenseStatus.Reimbursed)
            throw new DomainException("Cannot reject an already reimbursed expense.");

        Status = ExpenseStatus.Rejected;
        RejectionReason = reason;
    }

    /// <summary>
    /// Marks the claim as reimbursed via payroll.
    /// </summary>
    public void MarkAsReimbursed(int payrollRunId)
    {
        Status = ExpenseStatus.Reimbursed;
        PayrollRunId = payrollRunId;
    }
}
