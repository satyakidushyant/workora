using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.SubmitSelfReview;

/// <summary>
/// Command for an employee to submit their self-appraisal review.
/// </summary>
public record SubmitSelfReviewCommand(
    int Id,
    string Comments,
    int Rating) : IRequest<ApiResponse<AppraisalDto>>;

/// <summary>
/// Validator for <see cref="SubmitSelfReviewCommand"/>.
/// </summary>
public class SubmitSelfReviewCommandValidator : AbstractValidator<SubmitSelfReviewCommand>
{
    /// <summary>
    /// Initializes validation rules for self review.
    /// </summary>
    public SubmitSelfReviewCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid appraisal ID is required.");
        RuleFor(x => x.Comments).NotEmpty().WithMessage("Comments are required.");
        RuleFor(x => x.Rating).InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5.");
    }
}

/// <summary>
/// Handler for <see cref="SubmitSelfReviewCommand"/>.
/// </summary>
public class SubmitSelfReviewCommandHandler : IRequestHandler<SubmitSelfReviewCommand, ApiResponse<AppraisalDto>>
{
    private readonly IPerformanceRepository _performanceRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="SubmitSelfReviewCommandHandler"/> class.
    /// </summary>
    public SubmitSelfReviewCommandHandler(
        IPerformanceRepository performanceRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _performanceRepository = performanceRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AppraisalDto>> Handle(SubmitSelfReviewCommand request, CancellationToken ct)
    {
        var appraisal = await _performanceRepository.GetAppraisalWithDetailsAsync(request.Id, ct);
        if (appraisal == null)
        {
            return ApiResponse<AppraisalDto>.Fail(ResponseMessage.AppraisalNotFound.GetDescription());
        }

        appraisal.SubmitSelfReview(request.Comments, request.Rating);
        _performanceRepository.Update(appraisal);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<AppraisalDto>(appraisal);
        return ApiResponse<AppraisalDto>.Success(dto, ResponseMessage.SelfReviewSubmitted.GetDescription());
    }
}
