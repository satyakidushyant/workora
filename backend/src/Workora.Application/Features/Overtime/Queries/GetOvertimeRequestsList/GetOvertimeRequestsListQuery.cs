using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.Queries.GetOvertimeRequestsList;

/// <summary>
/// Query to retrieve a paginated and filtered list of overtime requests with dynamic pagination and filtering.
/// </summary>
public record GetOvertimeRequestsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<OvertimeRequestDto>>>
{
    /// <summary>
    /// Gets or init optional filter for employee ID.
    /// </summary>
    public int? EmployeeId { get; init; }

    /// <summary>
    /// Gets or init optional filter for department ID.
    /// </summary>
    public int? DepartmentId { get; init; }

    /// <summary>
    /// Gets or init optional filter for overtime request status.
    /// </summary>
    public OvertimeRequestStatus? Status { get; init; }

    /// <summary>
    /// Gets or init optional start date boundary.
    /// </summary>
    public DateOnly? FromDate { get; init; }

    /// <summary>
    /// Gets or init optional end date boundary.
    /// </summary>
    public DateOnly? ToDate { get; init; }
}

