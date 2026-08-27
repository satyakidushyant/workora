using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetJobOfferById;

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
            return ApiResponse<JobOfferDto>.Fail(ResponseMessage.JobOfferNotFound.GetDescription());
        }

        var dto = _mapper.Map<JobOfferDto>(offer);
        return ApiResponse<JobOfferDto>.Success(dto);
    }
}
