using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.SendJobOffer;

/// <summary>
/// Handler for <see cref="SendJobOfferCommand"/>.
/// </summary>
public class SendJobOfferCommandHandler : IRequestHandler<SendJobOfferCommand, ApiResponse<JobOfferDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="SendJobOfferCommandHandler"/> class.
    /// </summary>
    public SendJobOfferCommandHandler(
        IRecruitmentRepository recruitmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<JobOfferDto>> Handle(SendJobOfferCommand request, CancellationToken ct)
    {
        var offer = await _recruitmentRepository.GetOfferByIdAsync(request.Id, ct);
        if (offer == null)
        {
            return ApiResponse<JobOfferDto>.Fail(ResponseMessage.JobOfferNotFound.GetDescription());
        }

        offer.MarkSent();
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<JobOfferDto>(offer);
        return ApiResponse<JobOfferDto>.Success(dto, ResponseMessage.JobOfferSent.GetDescription());
    }
}
