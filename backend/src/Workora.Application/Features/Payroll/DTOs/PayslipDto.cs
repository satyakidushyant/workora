using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// DTO representing an individual employee payslip.
/// </summary>
public record PayslipDto(
    int Id,
    Guid Uuid,
    int PayrollRunId,
    int EmployeeId,
    string EmployeeCode,
    string EmployeeName,
    decimal GrossSalary,
    decimal TotalDeductions,
    decimal NetSalary,
    PaymentStatus PaymentStatus,
    DateTimeOffset? PaymentDate,
    IReadOnlyList<PayslipItemDto> Items,
    DateTimeOffset CreatedAt);
