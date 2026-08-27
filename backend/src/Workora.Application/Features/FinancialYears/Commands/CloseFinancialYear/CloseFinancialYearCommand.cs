using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.FinancialYears.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FinancialYears.Commands.CloseFinancialYear;

/// <summary>
/// Command to close a financial year.
/// </summary>
public record CloseFinancialYearCommand(int Id) : IRequest<ApiResponse<FinancialYearDto>>;
