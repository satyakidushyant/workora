using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Queries.ListExpenseClaims;

/// <summary>
/// Query to list company expense claims with dynamic pagination and filtering.
/// </summary>
public record ListExpenseClaimsQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<ExpenseClaimDto>>>
{
    /// <summary>
    /// Gets or init optional filter for expense status.
    /// </summary>
    public ExpenseStatus? Status { get; init; }

    /// <summary>
    /// Gets or init optional filter for expense category.
    /// </summary>
    public ExpenseCategory? Category { get; init; }

    /// <summary>
    /// Gets or init optional filter for company ID.
    /// </summary>
    public int? CompanyId { get; init; }
}

