using Workora.Domain.Enums;

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

/// <summary>
/// Data transfer object for a scheduled monthly loan installment.
/// </summary>
public record LoanEmiScheduleDto(
    int Id,
    Guid Uuid,
    int LoanRecordId,
    int InstallmentNumber,
    DateOnly DueDate,
    decimal EmiAmount,
    decimal PrincipalComponent,
    decimal InterestComponent,
    bool IsPaid,
    DateTimeOffset? PaidAt,
    int? PayrollRunId);
