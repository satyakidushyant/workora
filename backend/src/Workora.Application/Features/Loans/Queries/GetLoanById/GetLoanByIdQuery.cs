using AutoMapper;
using MediatR;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Queries.GetLoanById;

/// <summary>
/// Query to get loan details by ID.
/// </summary>
public record GetLoanByIdQuery(int LoanId) : IRequest<ApiResponse<LoanDto>>;
