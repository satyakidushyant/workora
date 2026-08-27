using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetInterviewsList;

/// <summary>
/// Query to list scheduled interviews.
/// </summary>
public record GetInterviewsListQuery(
    int? InterviewerId = null,
    int? CandidateId = null,
    InterviewStatus? Status = null) : IRequest<ApiResponse<IReadOnlyList<InterviewDto>>>;
