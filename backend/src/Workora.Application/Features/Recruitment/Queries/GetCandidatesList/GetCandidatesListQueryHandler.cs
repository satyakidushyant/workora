using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetCandidatesList;

/// <summary>
/// Handler for <see cref="GetCandidatesListQuery"/>.
/// </summary>
public class GetCandidatesListQueryHandler : IRequestHandler<GetCandidatesListQuery, ApiResponse<PagedResponse<CandidateDto>>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetCandidatesListQueryHandler"/> class.
    /// </summary>
    public GetCandidatesListQueryHandler(IRecruitmentRepository recruitmentRepository, IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<CandidateDto>>> Handle(GetCandidatesListQuery request, CancellationToken ct)
    {
        var candidates = await _recruitmentRepository.GetCandidatesPagedAsync(
            request.PageNumber,
            request.PageSize,
            request.JobPostingId,
            request.Stage,
            request.SearchTerm,
            ct);

        var totalCount = await _recruitmentRepository.GetCandidatesCountAsync(
            request.JobPostingId,
            request.Stage,
            request.SearchTerm,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<CandidateDto>>(candidates);
        var paged = new PagedResponse<CandidateDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<CandidateDto>>.Success(paged);
    }
}
