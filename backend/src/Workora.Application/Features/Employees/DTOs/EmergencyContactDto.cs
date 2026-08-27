using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Emergency contact DTO.
/// </summary>
public class EmergencyContactDto
{
    /// <summary>Identifier.</summary>
    public int Id { get; set; }

    /// <summary>Contact name.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Relationship description.</summary>
    public string Relationship { get; set; } = string.Empty;

    /// <summary>Phone number.</summary>
    public string PhoneNumber { get; set; } = string.Empty;

    /// <summary>Alternative phone number.</summary>
    public string? AlternativePhoneNumber { get; set; }

    /// <summary>Primary contact flag.</summary>
    public bool IsPrimary { get; set; }
}
