using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetJobPostingById;

/// <summary>
/// Query to retrieve details of a specific job posting.
/// </summary>
public record GetJobPostingByIdQuery(int Id) : IRequest<ApiResponse<JobPostingDto>>;

/// <summary>
/// Handler for <see cref="GetJobPostingByIdQuery"/>.
/// </summary>
public class GetJobPostingByIdQueryHandler : IRequestHandler<GetJobPostingByIdQuery, ApiResponse<JobPostingDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetJobPostingByIdQueryHandler"/> class.
    /// </summary>
    public GetJobPostingByIdQueryHandler(IRecruitmentRepository recruitmentRepository, IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<JobPostingDto>> Handle(GetJobPostingByIdQuery request, CancellationToken ct)
    {
        var job = await _recruitmentRepository.GetJobWithDetailsAsync(request.Id, ct);
        if (job == null)
        {
            return ApiResponse<JobPostingDto>.Fail("Job posting not found.");
        }

        var dto = _mapper.Map<JobPostingDto>(job);
        return ApiResponse<JobPostingDto>.Success(dto);
    }
}
