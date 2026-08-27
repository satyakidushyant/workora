using AutoMapper;
using MediatR;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Queries.GetExpenseClaimById;

/// <summary>
/// Query to get expense claim details by ID.
/// </summary>
public record GetExpenseClaimByIdQuery(int ClaimId) : IRequest<ApiResponse<ExpenseClaimDto>>;
