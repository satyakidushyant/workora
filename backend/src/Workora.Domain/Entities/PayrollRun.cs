using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a company-wide monthly payroll computation cycle.
/// </summary>
public class PayrollRun : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the parent company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Calendar month (1-12).
    /// </summary>
    public int PeriodMonth { get; private set; }

    /// <summary>
    /// Calendar year (e.g., 2026).
    /// </summary>
    public int PeriodYear { get; private set; }

    /// <summary>
    /// Lifecycle processing status of the payroll run.
    /// </summary>
    public PayrollStatus Status { get; private set; } = PayrollStatus.Draft;

    /// <summary>
    /// Total aggregate gross salary across all payslips.
    /// </summary>
    public decimal TotalGrossPay { get; private set; }

    /// <summary>
    /// Total aggregate deductions across all payslips.
    /// </summary>
    public decimal TotalDeductions { get; private set; }

    /// <summary>
    /// Total net disbursement payable.
    /// </summary>
    public decimal TotalNetPay { get; private set; }

    /// <summary>
    /// Timestamp when payroll was computed.
    /// </summary>
    public DateTimeOffset? ProcessedAt { get; private set; }

    /// <summary>
    /// User ID of the executive / finance officer who approved the payroll.
    /// </summary>
    public int? ApprovedBy { get; private set; }

    /// <summary>
    /// Timestamp when payroll was approved.
    /// </summary>
    public DateTimeOffset? ApprovedAt { get; private set; }

    /// <summary>
    /// Timestamp when funds were disbursed.
    /// </summary>
    public DateTimeOffset? DisbursedAt { get; private set; }

    private readonly List<Payslip> _payslips = new();
    /// <summary>
    /// Navigation collection of individual employee payslips.
    /// </summary>
    public IReadOnlyCollection<Payslip> Payslips => _payslips.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private PayrollRun() { }

    /// <summary>
    /// Creates a new PayrollRun cycle.
    /// </summary>
    public static PayrollRun Create(int companyId, int periodMonth, int periodYear)
    {
        return new PayrollRun
        {
            CompanyId = companyId,
            PeriodMonth = periodMonth,
            PeriodYear = periodYear,
            Status = PayrollStatus.Draft,
            IsActive = true
        };
    }

    /// <summary>
    /// Adds generated payslips and recalculates aggregate totals.
    /// </summary>
    public void SetPayslips(IEnumerable<Payslip> payslips)
    {
        _payslips.Clear();
        _payslips.AddRange(payslips);

        TotalGrossPay = _payslips.Sum(p => p.GrossSalary);
        TotalDeductions = _payslips.Sum(p => p.TotalDeductions);
        TotalNetPay = _payslips.Sum(p => p.NetSalary);
        Status = PayrollStatus.Calculated;
        ProcessedAt = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Approves the calculated payroll run.
    /// </summary>
    public void Approve(int approvedByUserId)
    {
        Status = PayrollStatus.Approved;
        ApprovedBy = approvedByUserId;
        ApprovedAt = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Marks the payroll run as disbursed and updates all child payslips.
    /// </summary>
    public void Disburse()
    {
        Status = PayrollStatus.Disbursed;
        DisbursedAt = DateTimeOffset.UtcNow;
        foreach (var payslip in _payslips)
        {
            payslip.MarkAsPaid(DisbursedAt.Value);
        }
    }
}

/// <summary>
/// Individual employee monthly compensation payslip.
/// </summary>
public class Payslip : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the parent payroll run.
    /// </summary>
    public int PayrollRunId { get; private set; }

    /// <summary>
    /// Navigation property to the payroll run.
    /// </summary>
    public PayrollRun PayrollRun { get; private set; } = null!;

    /// <summary>
    /// Foreign key identifier for the employee.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// Employee unique sequential code.
    /// </summary>
    public string EmployeeCode { get; private set; } = null!;

    /// <summary>
    /// Full employee legal name at time of calculation.
    /// </summary>
    public string EmployeeName { get; private set; } = null!;

    /// <summary>
    /// Total gross earnings before deductions.
    /// </summary>
    public decimal GrossSalary { get; private set; }

    /// <summary>
    /// Total deductions subtracted from earnings.
    /// </summary>
    public decimal TotalDeductions { get; private set; }

    /// <summary>
    /// Net pay amount payable to employee.
    /// </summary>
    public decimal NetSalary { get; private set; }

    /// <summary>
    /// Payment disbursement status.
    /// </summary>
    public PaymentStatus PaymentStatus { get; private set; } = PaymentStatus.Pending;

    /// <summary>
    /// Timestamp when payment disbursement was finalized.
    /// </summary>
    public DateTimeOffset? PaymentDate { get; private set; }

    private readonly List<PayslipItem> _items = new();
    /// <summary>
    /// Collection of itemized earnings and deductions.
    /// </summary>
    public IReadOnlyCollection<PayslipItem> Items => _items.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Payslip() { }

    /// <summary>
    /// Creates a new Payslip instance.
    /// </summary>
    public static Payslip Create(
        int payrollRunId,
        int employeeId,
        string employeeCode,
        string employeeName,
        decimal grossSalary,
        decimal totalDeductions,
        decimal netSalary,
        IEnumerable<PayslipItem> items)
    {
        var payslip = new Payslip
        {
            PayrollRunId = payrollRunId,
            EmployeeId = employeeId,
            EmployeeCode = employeeCode,
            EmployeeName = employeeName,
            GrossSalary = grossSalary,
            TotalDeductions = totalDeductions,
            NetSalary = netSalary,
            PaymentStatus = PaymentStatus.Pending,
            IsActive = true
        };

        payslip._items.AddRange(items);
        return payslip;
    }

    /// <summary>
    /// Marks the payslip as paid upon disbursement.
    /// </summary>
    public void MarkAsPaid(DateTimeOffset paymentDate)
    {
        PaymentStatus = PaymentStatus.Paid;
        PaymentDate = paymentDate;
    }
}

/// <summary>
/// Breakdown line item on a payslip.
/// </summary>
public class PayslipItem : BaseEntity
{
    /// <summary>
    /// Foreign key identifier for the parent payslip.
    /// </summary>
    public int PayslipId { get; private set; }

    /// <summary>
    /// Navigation property to the payslip.
    /// </summary>
    public Payslip Payslip { get; private set; } = null!;

    /// <summary>
    /// Name of the compensation component (e.g. Basic Salary, HRA, Provident Fund).
    /// </summary>
    public string ComponentName { get; private set; } = null!;

    /// <summary>
    /// Code of the compensation component.
    /// </summary>
    public string ComponentCode { get; private set; } = null!;

    /// <summary>
    /// Earning or Deduction.
    /// </summary>
    public ComponentType Type { get; private set; }

    /// <summary>
    /// Evaluated line item amount.
    /// </summary>
    public decimal Amount { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private PayslipItem() { }

    /// <summary>
    /// Creates a new PayslipItem instance.
    /// </summary>
    public static PayslipItem Create(
        int payslipId,
        string componentName,
        string componentCode,
        ComponentType type,
        decimal amount)
    {
        return new PayslipItem
        {
            PayslipId = payslipId,
            ComponentName = componentName,
            ComponentCode = componentCode,
            Type = type,
            Amount = amount,
            IsActive = true
        };
    }
}
