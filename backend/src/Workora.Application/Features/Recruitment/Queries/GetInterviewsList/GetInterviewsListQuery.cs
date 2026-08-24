using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetInterviewsList;

/// <summary>
/// Query to list scheduled interviews.
/// </summary>
public record GetInterviewsListQuery(
    int? InterviewerId = null,
    int? CandidateId = null,
    InterviewStatus? Status = null) : IRequest<ApiResponse<IReadOnlyList<InterviewDto>>>;

/// <summary>
/// Handler for <see cref="GetInterviewsListQuery"/>.
/// </summary>
public class GetInterviewsListQueryHandler : IRequestHandler<GetInterviewsListQuery, ApiResponse<IReadOnlyList<InterviewDto>>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetInterviewsListQueryHandler"/> class.
    /// </summary>
    public GetInterviewsListQueryHandler(IRecruitmentRepository recruitmentRepository, IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<InterviewDto>>> Handle(GetInterviewsListQuery request, CancellationToken ct)
    {
        var interviews = await _recruitmentRepository.GetInterviewsListAsync(request.InterviewerId, request.CandidateId, request.Status, ct);
        var dtos = _mapper.Map<IReadOnlyList<InterviewDto>>(interviews);
        return ApiResponse<IReadOnlyList<InterviewDto>>.Success(dtos);
    }
}
