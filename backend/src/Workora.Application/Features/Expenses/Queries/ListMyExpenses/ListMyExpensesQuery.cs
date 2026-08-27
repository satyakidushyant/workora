using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Queries.ListMyExpenses;

/// <summary>
/// Query to list all expense claims filed by the currently authenticated employee.
/// </summary>
public record ListMyExpensesQuery : IRequest<ApiResponse<List<ExpenseClaimDto>>>;
