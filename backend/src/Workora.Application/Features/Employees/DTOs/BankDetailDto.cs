using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Bank detail DTO.
/// </summary>
public class BankDetailDto
{
    /// <summary>Identifier.</summary>
    public int Id { get; set; }

    /// <summary>Bank institution name.</summary>
    public string BankName { get; set; } = string.Empty;

    /// <summary>Bank account number.</summary>
    public string AccountNumber { get; set; } = string.Empty;

    /// <summary>Account holder name.</summary>
    public string AccountHolderName { get; set; } = string.Empty;

    /// <summary>Branch routing code.</summary>
    public string? BranchCode { get; set; }

    /// <summary>SWIFT or BIC code.</summary>
    public string? SwiftCode { get; set; }

    /// <summary>Primary bank account flag.</summary>
    public bool IsPrimary { get; set; }
}
