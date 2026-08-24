using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents banking disbursement details for payroll payments.
/// </summary>
public class EmployeeBankDetail : BaseEntity
{
    /// <summary>
    /// Foreign key identifier for the employee.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// The name of the banking institution.
    /// </summary>
    public string BankName { get; private set; } = null!;

    /// <summary>
    /// The bank account number (encrypted at rest).
    /// </summary>
    public string AccountNumber { get; private set; } = null!;

    /// <summary>
    /// The full name of the account holder.
    /// </summary>
    public string AccountHolderName { get; private set; } = null!;

    /// <summary>
    /// The branch identifier / routing code.
    /// </summary>
    public string? BranchCode { get; private set; }

    /// <summary>
    /// The international SWIFT/BIC code.
    /// </summary>
    public string? SwiftCode { get; private set; }

    /// <summary>
    /// Indicates whether this account is the primary recipient for payroll disbursements.
    /// </summary>
    public bool IsPrimary { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private EmployeeBankDetail() { }

    /// <summary>
    /// Creates a new EmployeeBankDetail instance.
    /// </summary>
    public static EmployeeBankDetail Create(
        int employeeId,
        string bankName,
        string accountNumber,
        string accountHolderName,
        string? branchCode = null,
        string? swiftCode = null,
        bool isPrimary = true)
    {
        return new EmployeeBankDetail
        {
            EmployeeId = employeeId,
            BankName = bankName,
            AccountNumber = accountNumber,
            AccountHolderName = accountHolderName,
            BranchCode = branchCode,
            SwiftCode = swiftCode,
            IsPrimary = isPrimary,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates bank details.
    /// </summary>
    public void Update(string bankName, string accountNumber, string accountHolderName, string? branchCode, string? swiftCode, bool isPrimary)
    {
        BankName = bankName;
        AccountNumber = accountNumber;
        AccountHolderName = accountHolderName;
        BranchCode = branchCode;
        SwiftCode = swiftCode;
        IsPrimary = isPrimary;
    }
}
