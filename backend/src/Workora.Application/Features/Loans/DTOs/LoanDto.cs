using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.DTOs;

/// <summary>
/// Data transfer object representing an employee loan account.
/// </summary>
public record LoanDto(
    int Id,
    Guid Uuid,
    int EmployeeId,
    string? EmployeeName,
    string? EmployeeCode,
    LoanType LoanType,
    decimal PrincipalAmount,
    int TenureMonths,
    decimal MonthlyEmi,
    decimal TotalRepaid,
    decimal RemainingBalance,
    DateOnly DisbursementDate,
    LoanStatus Status,
    string Reason,
    int? ApprovedByUserId,
    DateTimeOffset? ApprovedAt,
    string? RejectionReason,
    DateTimeOffset CreatedAt);
