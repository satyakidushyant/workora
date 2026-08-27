using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetPayrollRunById;

/// <summary>
/// Query to retrieve a payroll run with all payslips and itemized breakdown.
/// </summary>
public record GetPayrollRunByIdQuery(int Id) : IRequest<ApiResponse<PayrollRunDetailDto>>;
