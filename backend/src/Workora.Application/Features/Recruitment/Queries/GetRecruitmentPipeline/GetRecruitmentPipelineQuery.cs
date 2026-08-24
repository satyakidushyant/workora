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

/// <summary>
/// Handler for <see cref="GetRecruitmentPipelineQuery"/>.
/// </summary>
public class GetRecruitmentPipelineQueryHandler : IRequestHandler<GetRecruitmentPipelineQuery, ApiResponse<RecruitmentPipelineDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetRecruitmentPipelineQueryHandler"/> class.
    /// </summary>
    public GetRecruitmentPipelineQueryHandler(IRecruitmentRepository recruitmentRepository)
    {
        _recruitmentRepository = recruitmentRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<RecruitmentPipelineDto>> Handle(GetRecruitmentPipelineQuery request, CancellationToken ct)
    {
        var metrics = await _recruitmentRepository.GetPipelineStageMetricsAsync(request.JobPostingId, request.CompanyId, ct);

        var stageList = metrics.Select(kv => new PipelineStageMetricsDto(kv.Key, kv.Value)).ToList();
        var total = stageList.Sum(s => s.Count);

        var pipeline = new RecruitmentPipelineDto(stageList, total);
        return ApiResponse<RecruitmentPipelineDto>.Success(pipeline);
    }
}
