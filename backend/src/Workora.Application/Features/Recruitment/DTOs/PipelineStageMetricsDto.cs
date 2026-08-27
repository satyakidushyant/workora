using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

/// <summary>
/// Recruitment pipeline stage summary DTO.
/// </summary>
public record PipelineStageMetricsDto(
    CandidateStage Stage,
    int Count);
