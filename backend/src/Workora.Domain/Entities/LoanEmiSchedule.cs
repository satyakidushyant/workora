using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a scheduled monthly installment for a loan.
/// </summary>
public class LoanEmiSchedule : BaseEntity
{
    /// <summary>
    /// Identifier of the parent loan.
    /// </summary>
    public int LoanRecordId { get; private set; }

    /// <summary>
    /// Gets the navigation property for the loan record.
    /// </summary>
    public LoanRecord LoanRecord { get; private set; } = null!;

    /// <summary>
    /// Sequential installment number (1, 2, ... N).
    /// </summary>
    public int InstallmentNumber { get; private set; }

    /// <summary>
    /// Expected due date for deduction.
    /// </summary>
    public DateOnly DueDate { get; private set; }

    /// <summary>
    /// Total EMI amount scheduled for this month.
    /// </summary>
    public decimal EmiAmount { get; private set; }

    /// <summary>
    /// Principal component of this EMI.
    /// </summary>
    public decimal PrincipalComponent { get; private set; }

    /// <summary>
    /// Interest component of this EMI.
    /// </summary>
    public decimal InterestComponent { get; private set; }

    /// <summary>
    /// Indicates whether this installment has been recovered.
    /// </summary>
    public bool IsPaid { get; private set; }

    /// <summary>
    /// Timestamp when payment/deduction was completed.
    /// </summary>
    public DateTimeOffset? PaidAt { get; private set; }

    /// <summary>
    /// Optional foreign key to the payroll run in which deduction occurred.
    /// </summary>
    public int? PayrollRunId { get; private set; }

    private LoanEmiSchedule() { } // EF Core

    /// <summary>
    /// Factory method to create a scheduled installment.
    /// </summary>
    public static LoanEmiSchedule Create(
        int loanRecordId,
        int installmentNumber,
        DateOnly dueDate,
        decimal emiAmount,
        decimal principalComponent,
        decimal interestComponent)
    {
        return new LoanEmiSchedule
        {
            LoanRecordId = loanRecordId,
            InstallmentNumber = installmentNumber,
            DueDate = dueDate,
            EmiAmount = emiAmount,
            PrincipalComponent = principalComponent,
            InterestComponent = interestComponent,
            IsPaid = false
        };
    }

    /// <summary>
    /// Marks the installment as paid/deducted via payroll.
    /// </summary>
    public void MarkAsPaid(int? payrollRunId)
    {
        IsPaid = true;
        PaidAt = DateTimeOffset.UtcNow;
        PayrollRunId = payrollRunId;
    }
}
