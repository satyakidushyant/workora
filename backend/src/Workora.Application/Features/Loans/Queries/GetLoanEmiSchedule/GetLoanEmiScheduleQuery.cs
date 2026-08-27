using AutoMapper;
using MediatR;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Queries.GetLoanEmiSchedule;

/// <summary>
/// Query to get the scheduled EMI amortization breakdown for a loan.
/// </summary>
public record GetLoanEmiScheduleQuery(int LoanId) : IRequest<ApiResponse<List<LoanEmiScheduleDto>>>;
