using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.DTOs;

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
