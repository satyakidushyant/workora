using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.SubmitManagerReview;

/// <summary>
/// Handler for <see cref="SubmitManagerReviewCommand"/>.
/// </summary>
public class SubmitManagerReviewCommandHandler : IRequestHandler<SubmitManagerReviewCommand, ApiResponse<AppraisalDto>>
{
    private readonly IPerformanceRepository _performanceRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="SubmitManagerReviewCommandHandler"/> class.
    /// </summary>
    public SubmitManagerReviewCommandHandler(
        IPerformanceRepository performanceRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _performanceRepository = performanceRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AppraisalDto>> Handle(SubmitManagerReviewCommand request, CancellationToken ct)
    {
        var appraisal = await _performanceRepository.GetAppraisalWithDetailsAsync(request.Id, ct);
        if (appraisal == null)
        {
            return ApiResponse<AppraisalDto>.Fail(ResponseMessage.AppraisalNotFound.GetDescription());
        }

        appraisal.SubmitManagerReview(request.Comments, request.Rating);
        _performanceRepository.Update(appraisal);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<AppraisalDto>(appraisal);
        return ApiResponse<AppraisalDto>.Success(dto, ResponseMessage.ManagerReviewSubmitted.GetDescription());
    }
}
