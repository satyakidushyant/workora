using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Queries.GetShiftsList;

/// <summary>
/// Query to get a paginated list of shifts with dynamic pagination and filtering.
/// </summary>
public record GetShiftsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<ShiftDto>>>
{
    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }
}

