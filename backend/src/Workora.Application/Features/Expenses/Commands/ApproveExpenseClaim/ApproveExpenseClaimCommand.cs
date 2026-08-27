using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Exceptions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Commands.ApproveExpenseClaim;

/// <summary>
/// Command to approve an expense claim at manager or finance level.
/// </summary>
public record ApproveExpenseClaimCommand(int ClaimId, int ApproverUserId, bool IsFinanceApproval) : IRequest<ApiResponse<ExpenseClaimDto>>;
