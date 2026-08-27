using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Exceptions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Commands.RejectLoan;

/// <summary>
/// Command to reject a loan application.
/// </summary>
public record RejectLoanCommand(int LoanId, int RejectedByUserId, string RejectionReason) : IRequest<ApiResponse<LoanDto>>;
