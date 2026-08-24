using Workora.Domain.Enums;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// DTO representing a salary structure template.
/// </summary>
public record SalaryStructureDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    string Name,
    string? Description,
    IReadOnlyList<SalaryComponentDto> Components,
    bool IsActive,
    DateTimeOffset CreatedAt);

/// <summary>
/// DTO representing a salary component line item.
/// </summary>
public record SalaryComponentDto(
    int Id,
    int SalaryStructureId,
    string Name,
    string Code,
    ComponentType Type,
    CalculationType CalculationType,
    decimal DefaultValue,
    bool IsTaxable);

/// <summary>
/// DTO representing an employee's assigned compensation structure.
/// </summary>
public record EmployeeSalaryAssignmentDto(
    int Id,
    int EmployeeId,
    int SalaryStructureId,
    string SalaryStructureName,
    decimal BaseSalary,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo,
    bool IsActive,
    IReadOnlyList<SalaryComponentDto> Components);

/// <summary>
/// DTO representing a monthly payroll computation cycle.
/// </summary>
public record PayrollRunDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    int PeriodMonth,
    int PeriodYear,
    PayrollStatus Status,
    decimal TotalGrossPay,
    decimal TotalDeductions,
    decimal TotalNetPay,
    int TotalEmployees,
    DateTimeOffset? ProcessedAt,
    int? ApprovedBy,
    DateTimeOffset? ApprovedAt,
    DateTimeOffset? DisbursedAt,
    DateTimeOffset CreatedAt);

/// <summary>
/// DTO representing a payroll run with itemized employee payslips.
/// </summary>
public record PayrollRunDetailDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    int PeriodMonth,
    int PeriodYear,
    PayrollStatus Status,
    decimal TotalGrossPay,
    decimal TotalDeductions,
    decimal TotalNetPay,
    DateTimeOffset? ProcessedAt,
    int? ApprovedBy,
    DateTimeOffset? ApprovedAt,
    DateTimeOffset? DisbursedAt,
    IReadOnlyList<PayslipDto> Payslips,
    DateTimeOffset CreatedAt);

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

/// <summary>
/// DTO representing a line item on a payslip.
/// </summary>
public record PayslipItemDto(
    int Id,
    string ComponentName,
    string ComponentCode,
    ComponentType Type,
    decimal Amount);

/// <summary>
/// Component item for creating a salary structure.
/// </summary>
public record CreateSalaryComponentDto(
    string Name,
    string Code,
    ComponentType Type,
    CalculationType CalculationType,
    decimal DefaultValue,
    bool IsTaxable);

/// <summary>
/// Request payload for creating a salary structure.
/// </summary>
public record CreateSalaryStructureRequestDto(
    int CompanyId,
    string Name,
    string? Description,
    IReadOnlyList<CreateSalaryComponentDto> Components);

/// <summary>
/// Request payload for updating a salary structure.
/// </summary>
public record UpdateSalaryStructureRequestDto(
    string Name,
    string? Description,
    IReadOnlyList<CreateSalaryComponentDto> Components);

/// <summary>
/// Request payload for assigning a salary structure to an employee.
/// </summary>
public record AssignSalaryStructureRequestDto(
    int EmployeeId,
    int SalaryStructureId,
    decimal BaseSalary,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo);

/// <summary>
/// Request payload for creating / executing a payroll run.
/// </summary>
public record CreatePayrollRunRequestDto(
    int CompanyId,
    int PeriodMonth,
    int PeriodYear);
