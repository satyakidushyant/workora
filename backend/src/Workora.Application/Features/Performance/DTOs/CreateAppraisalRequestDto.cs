using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.DTOs;

/// <summary>
/// Request payload for creating an appraisal cycle.
/// </summary>
public record CreateAppraisalRequestDto(
    int EmployeeId,
    int ReviewerEmployeeId,
    string Period,
    int Year);
