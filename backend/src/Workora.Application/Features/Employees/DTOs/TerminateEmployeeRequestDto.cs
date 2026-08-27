using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Request payload for terminating an employee.
/// </summary>
public record TerminateEmployeeRequestDto(
    DateOnly TerminationDate,
    string? Reason);
