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
/// Command to schedule an interview with a candidate.
/// </summary>
public record ScheduleInterviewCommand(
    int CandidateId,
    int InterviewerEmployeeId,
    DateTimeOffset ScheduledAt,
    string LocationOrLink) : IRequest<ApiResponse<InterviewDto>>;
