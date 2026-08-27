using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Exceptions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Commands.RejectExpenseClaim;

/// <summary>
/// Command to reject an expense claim.
/// </summary>
public record RejectExpenseClaimCommand(int ClaimId, int ReviewerUserId, string Reason) : IRequest<ApiResponse<ExpenseClaimDto>>;
