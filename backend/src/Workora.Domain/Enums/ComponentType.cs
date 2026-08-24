namespace Workora.Domain.Enums;

/// <summary>
/// Classifies whether a salary component is an earning or a deduction.
/// </summary>
public enum ComponentType
{
    /// <summary>
    /// Earning / addition component (e.g., Basic Salary, House Rent Allowance, Transport Allowance, Bonus).
    /// </summary>
    Earning = 1,

    /// <summary>
    /// Deduction component (e.g., Income Tax, Social Security, Provident Fund, Health Insurance).
    /// </summary>
    Deduction = 2
}
