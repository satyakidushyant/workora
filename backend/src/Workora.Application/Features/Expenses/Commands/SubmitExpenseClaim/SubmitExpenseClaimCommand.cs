using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Commands.SubmitExpenseClaim;

/// <summary>
/// Command to submit a new expense claim.
/// </summary>
public record SubmitExpenseClaimCommand(
    int EmployeeId,
    ExpenseCategory Category,
    DateOnly ExpenseDate,
    decimal Amount,
    string? MerchantName,
    string Description,
    string ReceiptUrl) : IRequest<ApiResponse<ExpenseClaimDto>>;
