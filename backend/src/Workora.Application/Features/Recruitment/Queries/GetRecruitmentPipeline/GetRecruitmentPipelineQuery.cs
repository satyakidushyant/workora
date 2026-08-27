using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetRecruitmentPipeline;

/// <summary>
/// Query to get aggregated recruitment candidate counts per stage.
/// </summary>
public record GetRecruitmentPipelineQuery(
    int? JobPostingId = null,
    int? CompanyId = null) : IRequest<ApiResponse<RecruitmentPipelineDto>>;
