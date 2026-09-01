using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Common.Models;

namespace Workora.Application.Features.Recruitment.Queries.GetInterviewsList;

/// <summary>
/// Handler for <see cref="GetInterviewsListQuery"/>.
/// </summary>
public class GetInterviewsListQueryHandler : IRequestHandler<GetInterviewsListQuery, ApiResponse<PagedResponse<InterviewDto>>>
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
    public async Task<ApiResponse<PagedResponse<InterviewDto>>> Handle(GetInterviewsListQuery request, CancellationToken ct)
    {
        var interviews = await _recruitmentRepository.GetInterviewsListAsync(request.InterviewerId, request.CandidateId, request.Status, ct);
        var filtered = interviews
            .Where(i => string.IsNullOrWhiteSpace(request.SearchTerm) ||
                        (i.LocationOrLink != null && i.LocationOrLink.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase)) ||
                        (i.Feedback != null && i.Feedback.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase)))
            .ToList();


        var totalCount = filtered.Count;
        var pagedInterviews = filtered
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var dtos = _mapper.Map<IReadOnlyList<InterviewDto>>(pagedInterviews);
        var pagedResponse = new PagedResponse<InterviewDto>(dtos, totalCount, request.PageNumber, request.PageSize);
        return ApiResponse<PagedResponse<InterviewDto>>.Success(pagedResponse);
    }
}

