using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.AcceptJobOffer;

/// <summary>
/// Handler for <see cref="AcceptJobOfferCommand"/>.
/// </summary>
public class AcceptJobOfferCommandHandler : IRequestHandler<AcceptJobOfferCommand, ApiResponse<JobOfferDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="AcceptJobOfferCommandHandler"/> class.
    /// </summary>
    public AcceptJobOfferCommandHandler(
        IRecruitmentRepository recruitmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<JobOfferDto>> Handle(AcceptJobOfferCommand request, CancellationToken ct)
    {
        var offer = await _recruitmentRepository.GetOfferByIdAsync(request.Id, ct);
        if (offer == null)
        {
            return ApiResponse<JobOfferDto>.Fail(ResponseMessage.JobOfferNotFound.GetDescription());
        }

        offer.Accept();

        if (offer.Candidate != null)
        {
            offer.Candidate.MoveStage(CandidateStage.Hired);
            _recruitmentRepository.UpdateCandidate(offer.Candidate);
        }

        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<JobOfferDto>(offer);
        return ApiResponse<JobOfferDto>.Success(dto, ResponseMessage.JobOfferAccepted.GetDescription());
    }
}
