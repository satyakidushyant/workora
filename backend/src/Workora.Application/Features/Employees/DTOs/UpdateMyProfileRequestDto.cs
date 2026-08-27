using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Request payload for self-service profile update by an employee.
/// </summary>
public record UpdateMyProfileRequestDto(
    string? Phone,
    string? Address);
