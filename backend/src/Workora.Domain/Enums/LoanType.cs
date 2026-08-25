namespace Workora.Domain.Enums;

/// <summary>
/// Defines the types of employee loans and advances.
/// </summary>
public enum LoanType
{
    /// <summary>
    /// Advance salary deducted in upcoming payroll.
    /// </summary>
    SalaryAdvance = 1,

    /// <summary>
    /// Standard personal employee loan spread across multiple EMI installments.
    /// </summary>
    PersonalLoan = 2,

    /// <summary>
    /// Emergency medical or distress assistance loan.
    /// </summary>
    EmergencyLoan = 3
}
