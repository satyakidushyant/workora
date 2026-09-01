using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetJobPostingsList;

/// <summary>
/// Query to retrieve a paginated list of job postings with dynamic pagination and filtering.
/// </summary>
public record GetJobPostingsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<JobPostingDto>>>
{
    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }

    /// <summary>
    /// Gets or init optional filter for department ID.
    /// </summary>
    public int? DepartmentId { get; init; }

    /// <summary>
    /// Gets or init optional filter for job posting status.
    /// </summary>
    public JobStatus? Status { get; init; }
}

