using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.SubmitInterviewFeedback;

/// <summary>
/// Command to record feedback notes and rating score for an interview.
/// </summary>
public record SubmitInterviewFeedbackCommand(
    int Id,
    string Feedback,
    int Rating) : IRequest<ApiResponse<InterviewDto>>;

/// <summary>
/// Validator for <see cref="SubmitInterviewFeedbackCommand"/>.
/// </summary>
public class SubmitInterviewFeedbackCommandValidator : AbstractValidator<SubmitInterviewFeedbackCommand>
{
    /// <summary>
    /// Initializes validation rules for interview feedback.
    /// </summary>
    public SubmitInterviewFeedbackCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid interview ID is required.");
        RuleFor(x => x.Feedback).NotEmpty().WithMessage("Feedback comments are required.");
        RuleFor(x => x.Rating).InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5 stars.");
    }
}

/// <summary>
/// Handler for <see cref="SubmitInterviewFeedbackCommand"/>.
/// </summary>
public class SubmitInterviewFeedbackCommandHandler : IRequestHandler<SubmitInterviewFeedbackCommand, ApiResponse<InterviewDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="SubmitInterviewFeedbackCommandHandler"/> class.
    /// </summary>
    public SubmitInterviewFeedbackCommandHandler(
        IRecruitmentRepository recruitmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<InterviewDto>> Handle(SubmitInterviewFeedbackCommand request, CancellationToken ct)
    {
        var interview = await _recruitmentRepository.GetInterviewByIdAsync(request.Id, ct);
        if (interview == null)
        {
            return ApiResponse<InterviewDto>.Fail(ResponseMessage.InterviewNotFound.GetDescription());
        }

        interview.SubmitFeedback(request.Feedback, request.Rating);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<InterviewDto>(interview);
        return ApiResponse<InterviewDto>.Success(dto, ResponseMessage.InterviewFeedbackSubmitted.GetDescription());
    }
}
