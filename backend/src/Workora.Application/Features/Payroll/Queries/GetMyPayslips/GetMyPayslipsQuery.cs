using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetMyPayslips;

/// <summary>
/// Query for an employee to retrieve all their issued payslips.
/// </summary>
public record GetMyPayslipsQuery(int? Year = null) : IRequest<ApiResponse<IReadOnlyList<PayslipDto>>>;
