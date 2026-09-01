using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetCandidatesList;

/// <summary>
/// Query to retrieve a paginated and filtered list of candidate applicants with dynamic pagination and filtering.
/// </summary>
public record GetCandidatesListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<CandidateDto>>>
{
    /// <summary>
    /// Gets or init optional filter for job posting ID.
    /// </summary>
    public int? JobPostingId { get; init; }

    /// <summary>
    /// Gets or init optional filter for candidate pipeline stage.
    /// </summary>
    public CandidateStage? Stage { get; init; }

    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }
}

