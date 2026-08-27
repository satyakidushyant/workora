using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Detailed DTO for an employee with contacts, bank info, and history.
/// </summary>
public class EmployeeDetailDto : EmployeeDto
{
    /// <summary>Termination reason notes.</summary>
    public string? TerminationReason { get; set; }

    /// <summary>Residential address.</summary>
    public string? Address { get; set; }

    /// <summary>Emergency contacts collection.</summary>
    public List<EmergencyContactDto> EmergencyContacts { get; set; } = new();

    /// <summary>Bank details collection.</summary>
    public List<BankDetailDto> BankDetails { get; set; } = new();

    /// <summary>Employment transitions history.</summary>
    public List<EmploymentHistoryDto> EmploymentHistory { get; set; } = new();
}
