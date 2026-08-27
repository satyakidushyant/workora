using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.DeclineJobOffer;

/// <summary>
/// Handler for <see cref="DeclineJobOfferCommand"/>.
/// </summary>
public class DeclineJobOfferCommandHandler : IRequestHandler<DeclineJobOfferCommand, ApiResponse<JobOfferDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeclineJobOfferCommandHandler"/> class.
    /// </summary>
    public DeclineJobOfferCommandHandler(
        IRecruitmentRepository recruitmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<JobOfferDto>> Handle(DeclineJobOfferCommand request, CancellationToken ct)
    {
        var offer = await _recruitmentRepository.GetOfferByIdAsync(request.Id, ct);
        if (offer == null)
        {
            return ApiResponse<JobOfferDto>.Fail(ResponseMessage.JobOfferNotFound.GetDescription());
        }

        offer.Decline();

        if (offer.Candidate != null)
        {
            offer.Candidate.MoveStage(CandidateStage.Rejected);
            _recruitmentRepository.UpdateCandidate(offer.Candidate);
        }

        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<JobOfferDto>(offer);
        return ApiResponse<JobOfferDto>.Success(dto, ResponseMessage.JobOfferDeclined.GetDescription());
    }
}
