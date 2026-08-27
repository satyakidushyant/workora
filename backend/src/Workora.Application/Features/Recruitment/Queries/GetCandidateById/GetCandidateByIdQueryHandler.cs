using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetCandidateById;

/// <summary>
/// Handler for <see cref="GetCandidateByIdQuery"/>.
/// </summary>
public class GetCandidateByIdQueryHandler : IRequestHandler<GetCandidateByIdQuery, ApiResponse<CandidateDetailDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetCandidateByIdQueryHandler"/> class.
    /// </summary>
    public GetCandidateByIdQueryHandler(IRecruitmentRepository recruitmentRepository, IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<CandidateDetailDto>> Handle(GetCandidateByIdQuery request, CancellationToken ct)
    {
        var candidate = await _recruitmentRepository.GetCandidateByIdAsync(request.Id, ct);
        if (candidate == null)
        {
            return ApiResponse<CandidateDetailDto>.Fail(ResponseMessage.CandidateNotFound.GetDescription());
        }

        var dto = _mapper.Map<CandidateDetailDto>(candidate);
        return ApiResponse<CandidateDetailDto>.Success(dto);
    }
}
