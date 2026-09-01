using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Queries.GetAppraisalsList;

/// <summary>
/// Query to retrieve a paginated and filtered list of performance appraisals with dynamic pagination and filtering.
/// </summary>
public record GetAppraisalsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<AppraisalDto>>>
{
    /// <summary>
    /// Gets or init optional filter for target employee ID.
    /// </summary>
    public int? EmployeeId { get; init; }

    /// <summary>
    /// Gets or init optional filter for reviewer employee ID.
    /// </summary>
    public int? ReviewerId { get; init; }

    /// <summary>
    /// Gets or init optional filter for evaluation year.
    /// </summary>
    public int? Year { get; init; }

    /// <summary>
    /// Gets or init optional filter for appraisal status.
    /// </summary>
    public AppraisalStatus? Status { get; init; }
}

