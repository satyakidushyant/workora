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
