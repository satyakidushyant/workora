using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.DTOs;

/// <summary>
/// Recruitment pipeline overview response DTO.
/// </summary>
public record RecruitmentPipelineDto(
    IReadOnlyList<PipelineStageMetricsDto> Stages,
    int TotalCandidates);
