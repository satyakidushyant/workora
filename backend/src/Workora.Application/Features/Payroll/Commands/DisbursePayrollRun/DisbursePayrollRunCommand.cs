using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.DisbursePayrollRun;

/// <summary>
/// Command to disburse an approved payroll run.
/// </summary>
public record DisbursePayrollRunCommand(int Id) : IRequest<ApiResponse<PayrollRunDto>>;
