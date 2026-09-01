using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Queries.GetAttendanceCorrectionsList;

/// <summary>
/// Query to retrieve a paginated list of attendance correction requests with dynamic pagination and filtering.
/// </summary>
public record GetAttendanceCorrectionsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<AttendanceCorrectionDto>>>
{
    /// <summary>
    /// Gets or init optional filter for correction status.
    /// </summary>
    public CorrectionStatus? Status { get; init; }

    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }
}

