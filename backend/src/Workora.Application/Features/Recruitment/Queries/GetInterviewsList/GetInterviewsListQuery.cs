using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetInterviewsList;

/// <summary>
/// Query to list scheduled interviews with dynamic pagination and filtering.
/// </summary>
public record GetInterviewsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<InterviewDto>>>
{
    /// <summary>
    /// Gets or init optional filter for interviewer employee ID.
    /// </summary>
    public int? InterviewerId { get; init; }

    /// <summary>
    /// Gets or init optional filter for candidate ID.
    /// </summary>
    public int? CandidateId { get; init; }

    /// <summary>
    /// Gets or init optional filter for interview status.
    /// </summary>
    public InterviewStatus? Status { get; init; }
}

