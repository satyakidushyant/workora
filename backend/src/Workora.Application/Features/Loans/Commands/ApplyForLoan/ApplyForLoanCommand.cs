using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Commands.ApplyForLoan;

/// <summary>
/// Command to apply for a loan or salary advance.
/// </summary>
public record ApplyForLoanCommand(
    int EmployeeId,
    LoanType LoanType,
    decimal PrincipalAmount,
    int TenureMonths,
    string Reason,
    DateOnly DisbursementDate) : IRequest<ApiResponse<LoanDto>>;
