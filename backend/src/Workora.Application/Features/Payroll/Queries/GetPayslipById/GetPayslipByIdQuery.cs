using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetPayslipById;

/// <summary>
/// Query to retrieve a specific payslip by ID with all itemized components.
/// </summary>
public record GetPayslipByIdQuery(int Id) : IRequest<ApiResponse<PayslipDto>>;
