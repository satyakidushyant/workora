using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.CreatePayrollRun;

/// <summary>
/// Command to initiate and calculate monthly payroll for all eligible employees in a company.
/// </summary>
public record CreatePayrollRunCommand(
    int CompanyId,
    int PeriodMonth,
    int PeriodYear) : IRequest<ApiResponse<PayrollRunDetailDto>>;
