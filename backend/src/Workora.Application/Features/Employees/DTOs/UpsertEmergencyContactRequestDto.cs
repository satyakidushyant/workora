using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Request payload for adding or updating an emergency contact.
/// </summary>
public record UpsertEmergencyContactRequestDto(
    int? Id,
    string Name,
    string Relationship,
    string PhoneNumber,
    string? AlternativePhoneNumber,
    bool IsPrimary);
