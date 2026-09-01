using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetPayrollRunsList;

/// <summary>
/// Query to retrieve a paginated list of payroll run cycles with dynamic pagination and filtering.
/// </summary>
public record GetPayrollRunsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<PayrollRunDto>>>
{
    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }

    /// <summary>
    /// Gets or init optional filter for payroll run status.
    /// </summary>
    public PayrollStatus? Status { get; init; }
}

