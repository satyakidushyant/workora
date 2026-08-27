using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.CreateJobOffer;

/// <summary>
/// Handler for <see cref="CreateJobOfferCommand"/>.
/// </summary>
public class CreateJobOfferCommandHandler : IRequestHandler<CreateJobOfferCommand, ApiResponse<JobOfferDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateJobOfferCommandHandler"/> class.
    /// </summary>
    public CreateJobOfferCommandHandler(
        IRecruitmentRepository recruitmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<JobOfferDto>> Handle(CreateJobOfferCommand request, CancellationToken ct)
    {
        var candidate = await _recruitmentRepository.GetCandidateByIdAsync(request.CandidateId, ct);
        if (candidate == null)
        {
            return ApiResponse<JobOfferDto>.Fail(ResponseMessage.CandidateNotFound.GetDescription());
        }

        var offer = JobOffer.Create(
            request.CandidateId,
            request.OfferedSalary,
            request.JoiningDate,
            request.ExpiryDate,
            request.Notes);

        await _recruitmentRepository.AddOfferAsync(offer, ct);

        candidate.MoveStage(CandidateStage.Offered);
        _recruitmentRepository.UpdateCandidate(candidate);

        await _unitOfWork.SaveChangesAsync(ct);

        var loaded = await _recruitmentRepository.GetOfferByIdAsync(offer.Id, ct);
        var dto = _mapper.Map<JobOfferDto>(loaded ?? offer);
        return ApiResponse<JobOfferDto>.Success(dto, ResponseMessage.JobOfferCreated.GetDescription());
    }
}
