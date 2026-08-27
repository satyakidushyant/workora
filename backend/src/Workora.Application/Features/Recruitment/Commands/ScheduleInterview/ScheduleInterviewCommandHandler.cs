using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.ScheduleInterview;

/// <summary>
/// Handler for <see cref="ScheduleInterviewCommand"/>.
/// </summary>
public class ScheduleInterviewCommandHandler : IRequestHandler<ScheduleInterviewCommand, ApiResponse<InterviewDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="ScheduleInterviewCommandHandler"/> class.
    /// </summary>
    public ScheduleInterviewCommandHandler(
        IRecruitmentRepository recruitmentRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<InterviewDto>> Handle(ScheduleInterviewCommand request, CancellationToken ct)
    {
        var candidate = await _recruitmentRepository.GetCandidateByIdAsync(request.CandidateId, ct);
        if (candidate == null)
        {
            return ApiResponse<InterviewDto>.Fail(ResponseMessage.CandidateNotFound.GetDescription());
        }

        var interviewer = await _employeeRepository.GetByIdAsync(request.InterviewerEmployeeId, ct);
        if (interviewer == null)
        {
            return ApiResponse<InterviewDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var interview = Interview.Create(
            request.CandidateId,
            request.InterviewerEmployeeId,
            request.ScheduledAt,
            request.LocationOrLink);

        await _recruitmentRepository.AddInterviewAsync(interview, ct);

        candidate.MoveStage(CandidateStage.Interview);
        _recruitmentRepository.UpdateCandidate(candidate);

        await _unitOfWork.SaveChangesAsync(ct);

        var loaded = await _recruitmentRepository.GetInterviewByIdAsync(interview.Id, ct);
        var dto = _mapper.Map<InterviewDto>(loaded ?? interview);
        return ApiResponse<InterviewDto>.Success(dto, ResponseMessage.InterviewScheduled.GetDescription());
    }
}
