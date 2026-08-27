using AutoMapper;
using MediatR;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Queries.ListExpenseClaims;

/// <summary>
/// Query to list company expense claims with optional status and category filters.
/// </summary>
public record ListExpenseClaimsQuery(ExpenseStatus? Status = null, ExpenseCategory? Category = null, int? CompanyId = null) : IRequest<ApiResponse<List<ExpenseClaimDto>>>;
