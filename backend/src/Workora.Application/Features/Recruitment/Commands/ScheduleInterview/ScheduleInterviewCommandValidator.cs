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
/// Validator for <see cref="ScheduleInterviewCommand"/>.
/// </summary>
public class ScheduleInterviewCommandValidator : AbstractValidator<ScheduleInterviewCommand>
{
    /// <summary>
    /// Initializes validation rules for scheduling interviews.
    /// </summary>
    public ScheduleInterviewCommandValidator()
    {
        RuleFor(x => x.CandidateId).GreaterThan(0).WithMessage("Valid candidate ID is required.");
        RuleFor(x => x.InterviewerEmployeeId).GreaterThan(0).WithMessage("Valid interviewer ID is required.");
        RuleFor(x => x.LocationOrLink).NotEmpty().MaximumLength(500).WithMessage("Location or meeting link is required.");
    }
}
