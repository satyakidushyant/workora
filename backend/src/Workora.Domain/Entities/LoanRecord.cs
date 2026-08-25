using Workora.Domain.Common;
using Workora.Domain.Enums;
using Workora.Domain.Exceptions;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an employee loan or salary advance record.
/// </summary>
public class LoanRecord : AuditableEntity
{
    /// <summary>
    /// The employee receiving the loan.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Gets the navigation property for the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// The type of loan (SalaryAdvance, PersonalLoan, EmergencyLoan).
    /// </summary>
    public LoanType LoanType { get; private set; }

    /// <summary>
    /// The principal amount borrowed.
    /// </summary>
    public decimal PrincipalAmount { get; private set; }

    /// <summary>
    /// The repayment tenure in months.
    /// </summary>
    public int TenureMonths { get; private set; }

    /// <summary>
    /// The calculated monthly EMI deduction amount.
    /// </summary>
    public decimal MonthlyEmi { get; private set; }

    /// <summary>
    /// Total amount repaid to date.
    /// </summary>
    public decimal TotalRepaid { get; private set; }

    /// <summary>
    /// Outstanding remaining balance to be recovered.
    /// </summary>
    public decimal RemainingBalance { get; private set; }

    /// <summary>
    /// Date when the loan was disbursed.
    /// </summary>
    public DateOnly DisbursementDate { get; private set; }

    /// <summary>
    /// Current lifecycle status of the loan.
    /// </summary>
    public LoanStatus Status { get; private set; }

    /// <summary>
    /// The stated reason for the loan request.
    /// </summary>
    public string Reason { get; private set; } = string.Empty;

    /// <summary>
    /// User ID of the manager/finance officer who approved the loan.
    /// </summary>
    public int? ApprovedByUserId { get; private set; }

    /// <summary>
    /// Timestamp when the loan was approved.
    /// </summary>
    public DateTimeOffset? ApprovedAt { get; private set; }

    /// <summary>
    /// Optional rejection reason if the loan was not approved.
    /// </summary>
    public string? RejectionReason { get; private set; }

    private readonly List<LoanEmiSchedule> _emiSchedules = new();

    /// <summary>
    /// Gets the scheduled EMI installments for this loan.
    /// </summary>
    public IReadOnlyCollection<LoanEmiSchedule> EmiSchedules => _emiSchedules.AsReadOnly();

    private LoanRecord() { } // EF Core

    /// <summary>
    /// Factory method to create a new loan application.
    /// </summary>
    public static LoanRecord Create(
        int employeeId,
        LoanType loanType,
        decimal principalAmount,
        int tenureMonths,
        string reason,
        DateOnly disbursementDate)
    {
        if (principalAmount <= 0)
            throw new DomainException("Loan principal amount must be greater than zero.");

        if (tenureMonths <= 0)
            throw new DomainException("Tenure months must be at least 1.");

        var monthlyEmi = Math.Round(principalAmount / tenureMonths, 2, MidpointRounding.AwayFromZero);

        var loan = new LoanRecord
        {
            EmployeeId = employeeId,
            LoanType = loanType,
            PrincipalAmount = principalAmount,
            TenureMonths = tenureMonths,
            MonthlyEmi = monthlyEmi,
            TotalRepaid = 0,
            RemainingBalance = principalAmount,
            DisbursementDate = disbursementDate,
            Status = LoanStatus.PendingApproval,
            Reason = reason
        };

        return loan;
    }

    /// <summary>
    /// Approves the loan and generates the monthly EMI amortization schedule.
    /// </summary>
    public void Approve(int approvedByUserId)
    {
        if (Status != LoanStatus.PendingApproval)
            throw new DomainException($"Cannot approve a loan in {Status} status.");

        Status = LoanStatus.Active;
        ApprovedByUserId = approvedByUserId;
        ApprovedAt = DateTimeOffset.UtcNow;

        _emiSchedules.Clear();
        var currentDate = DisbursementDate;
        var remaining = PrincipalAmount;

        for (int i = 1; i <= TenureMonths; i++)
        {
            var isLast = i == TenureMonths;
            var emi = isLast ? remaining : MonthlyEmi;
            remaining -= emi;

            var schedule = LoanEmiSchedule.Create(
                Id,
                i,
                currentDate.AddMonths(i),
                emi,
                emi,
                0);

            _emiSchedules.Add(schedule);
        }
    }

    /// <summary>
    /// Rejects the loan application.
    /// </summary>
    public void Reject(int rejectedByUserId, string rejectionReason)
    {
        if (Status != LoanStatus.PendingApproval)
            throw new DomainException($"Cannot reject a loan in {Status} status.");

        Status = LoanStatus.Rejected;
        ApprovedByUserId = rejectedByUserId;
        ApprovedAt = DateTimeOffset.UtcNow;
        RejectionReason = rejectionReason;
    }

    /// <summary>
    /// Records an EMI installment payment and updates remaining balance.
    /// </summary>
    public void RecordRepayment(decimal amount)
    {
        TotalRepaid += amount;
        RemainingBalance = Math.Max(0, PrincipalAmount - TotalRepaid);

        if (RemainingBalance == 0)
        {
            Status = LoanStatus.Closed;
        }
    }
}
