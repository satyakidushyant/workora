using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetJobOfferById;

/// <summary>
/// Query to retrieve details of a specific job offer.
/// </summary>
public record GetJobOfferByIdQuery(int Id) : IRequest<ApiResponse<JobOfferDto>>;

/// <summary>
/// Handler for <see cref="GetJobOfferByIdQuery"/>.
/// </summary>
public class GetJobOfferByIdQueryHandler : IRequestHandler<GetJobOfferByIdQuery, ApiResponse<JobOfferDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetJobOfferByIdQueryHandler"/> class.
    /// </summary>
    public GetJobOfferByIdQueryHandler(IRecruitmentRepository recruitmentRepository, IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<JobOfferDto>> Handle(GetJobOfferByIdQuery request, CancellationToken ct)
    {
        var offer = await _recruitmentRepository.GetOfferByIdAsync(request.Id, ct);
        if (offer == null)
        {
            return ApiResponse<JobOfferDto>.Fail("Job offer not found.");
        }

        var dto = _mapper.Map<JobOfferDto>(offer);
        return ApiResponse<JobOfferDto>.Success(dto);
    }
}
