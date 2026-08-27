using Workora.Domain.Enums;

namespace Workora.Application.Features.Expenses.DTOs;

/// <summary>
/// Data transfer object for an expense reimbursement claim.
/// </summary>
public record ExpenseClaimDto(
    int Id,
    Guid Uuid,
    int EmployeeId,
    string? EmployeeName,
    string? EmployeeCode,
    ExpenseCategory Category,
    DateOnly ExpenseDate,
    decimal Amount,
    string? MerchantName,
    string Description,
    string ReceiptUrl,
    ExpenseStatus Status,
    int? ManagerApprovedByUserId,
    DateTimeOffset? ManagerApprovedAt,
    int? FinanceApprovedByUserId,
    DateTimeOffset? FinanceApprovedAt,
    string? RejectionReason,
    int? PayrollRunId,
    DateTimeOffset CreatedAt);
