using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

/// <summary>
/// Request payload for advancing a candidate's stage.
/// </summary>
public record MoveCandidateStageRequestDto(
    CandidateStage Stage);
