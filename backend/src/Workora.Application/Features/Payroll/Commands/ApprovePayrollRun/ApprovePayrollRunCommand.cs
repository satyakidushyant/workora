using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.ApprovePayrollRun;

/// <summary>
/// Command to approve a calculated payroll run.
/// </summary>
public record ApprovePayrollRunCommand(int Id) : IRequest<ApiResponse<PayrollRunDto>>;
