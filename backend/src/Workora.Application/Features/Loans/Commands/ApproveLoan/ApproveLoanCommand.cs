using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Exceptions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Commands.ApproveLoan;

/// <summary>
/// Command to approve a loan and generate EMI schedules.
/// </summary>
public record ApproveLoanCommand(int LoanId, int ApprovedByUserId) : IRequest<ApiResponse<LoanDto>>;
