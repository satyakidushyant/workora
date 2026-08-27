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
