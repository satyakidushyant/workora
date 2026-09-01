using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Queries.ListCompanyLoans;

/// <summary>
/// Query to list company loans with dynamic pagination and filtering.
/// </summary>
public record ListCompanyLoansQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<LoanDto>>>
{
    /// <summary>
    /// Gets or init optional filter for company ID.
    /// </summary>
    public int? CompanyId { get; init; }

    /// <summary>
    /// Gets or init optional filter for loan status.
    /// </summary>
    public LoanStatus? Status { get; init; }
}

