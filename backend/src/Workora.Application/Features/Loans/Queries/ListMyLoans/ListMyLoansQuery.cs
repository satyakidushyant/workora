using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Queries.ListMyLoans;

/// <summary>
/// Query to list active and past loans for the currently authenticated employee.
/// </summary>
public record ListMyLoansQuery : IRequest<ApiResponse<List<LoanDto>>>;
