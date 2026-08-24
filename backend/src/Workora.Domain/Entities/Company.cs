using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a company/tenant entity in the system.
/// </summary>
public class Company : AuditableEntity
{
    /// <summary>
    /// The official company name.
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// The unique corporate code.
    /// </summary>
    public string Code { get; private set; } = null!;

    /// <summary>
    /// The legal registration number.
    /// </summary>
    public string? RegistrationNumber { get; private set; }

    /// <summary>
    /// The corporate tax identifier.
    /// </summary>
    public string? TaxId { get; private set; }

    /// <summary>
    /// The primary corporate email.
    /// </summary>
    public string? Email { get; private set; }

    /// <summary>
    /// The primary corporate phone number.
    /// </summary>
    public string? Phone { get; private set; }

    /// <summary>
    /// The official corporate website URL.
    /// </summary>
    public string? Website { get; private set; }

    /// <summary>
    /// The path or URL to the company logo image.
    /// </summary>
    public string? LogoUrl { get; private set; }

    /// <summary>
    /// The starting month of the fiscal year (1 to 12).
    /// </summary>
    public int FiscalYearStartMonth { get; private set; } = 1;

    /// <summary>
    /// The default base currency code (e.g. USD, EUR, INR).
    /// </summary>
    public string Currency { get; private set; } = "USD";

    /// <summary>
    /// The registered physical address of the company.
    /// </summary>
    public string? Address { get; private set; }

    private readonly List<Branch> _branches = new();
    /// <summary>
    /// Gets the collection of branches under this company.
    /// </summary>
    public IReadOnlyCollection<Branch> Branches => _branches.AsReadOnly();

    private readonly List<Department> _departments = new();
    /// <summary>
    /// Gets the collection of departments under this company.
    /// </summary>
    public IReadOnlyCollection<Department> Departments => _departments.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Company() { }

    /// <summary>
    /// Creates a new Company instance.
    /// </summary>
    public static Company Create(
        string name,
        string code,
        string? registrationNumber = null,
        string? taxId = null,
        string? email = null,
        string? phone = null,
        string? website = null,
        int fiscalYearStartMonth = 1,
        string currency = "USD",
        string? address = null)
    {
        return new Company
        {
            Name = name,
            Code = code.ToUpperInvariant(),
            RegistrationNumber = registrationNumber,
            TaxId = taxId,
            Email = email,
            Phone = phone,
            Website = website,
            FiscalYearStartMonth = fiscalYearStartMonth,
            Currency = currency.ToUpperInvariant(),
            Address = address,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the company's profile information.
    /// </summary>
    public void UpdateProfile(
        string name,
        string? registrationNumber,
        string? taxId,
        string? email,
        string? phone,
        string? website,
        int fiscalYearStartMonth,
        string currency,
        string? address)
    {
        Name = name;
        RegistrationNumber = registrationNumber;
        TaxId = taxId;
        Email = email;
        Phone = phone;
        Website = website;
        FiscalYearStartMonth = fiscalYearStartMonth;
        Currency = currency.ToUpperInvariant();
        Address = address;
    }

    /// <summary>
    /// Updates the company logo URL.
    /// </summary>
    public void UpdateLogo(string? logoUrl)
    {
        LogoUrl = logoUrl;
    }
}
