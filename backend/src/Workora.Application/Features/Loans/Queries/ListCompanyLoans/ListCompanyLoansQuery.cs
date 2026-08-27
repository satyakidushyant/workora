using AutoMapper;
using MediatR;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Queries.ListCompanyLoans;

/// <summary>
/// Query to list company loans filtered by optional status.
/// </summary>
public record ListCompanyLoansQuery(int? CompanyId, LoanStatus? Status) : IRequest<ApiResponse<List<LoanDto>>>;
