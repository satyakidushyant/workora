using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Request payload for adding or updating bank details.
/// </summary>
public record UpsertBankDetailsRequestDto(
    int? Id,
    string BankName,
    string AccountNumber,
    string AccountHolderName,
    string? BranchCode,
    string? SwiftCode,
    bool IsPrimary);
