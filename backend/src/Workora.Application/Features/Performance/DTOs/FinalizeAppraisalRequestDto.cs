using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.DTOs;

/// <summary>
/// Request payload for finalizing an appraisal.
/// </summary>
public record FinalizeAppraisalRequestDto(
    decimal FinalScore);
