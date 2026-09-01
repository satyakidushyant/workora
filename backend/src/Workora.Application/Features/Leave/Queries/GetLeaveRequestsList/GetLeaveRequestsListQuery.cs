using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Queries.GetLeaveRequestsList;

/// <summary>
/// Query to retrieve a paginated and filtered list of leave requests with dynamic pagination and filtering.
/// </summary>
public record GetLeaveRequestsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<LeaveRequestDto>>>
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
    /// Gets or init optional filter for leave request status.
    /// </summary>
    public LeaveRequestStatus? Status { get; init; }

    /// <summary>
    /// Gets or init optional start date boundary.
    /// </summary>
    public DateOnly? FromDate { get; init; }

    /// <summary>
    /// Gets or init optional end date boundary.
    /// </summary>
    public DateOnly? ToDate { get; init; }

    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }
}

