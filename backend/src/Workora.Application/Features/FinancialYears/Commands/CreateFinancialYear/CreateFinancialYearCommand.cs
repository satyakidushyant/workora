using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.FinancialYears.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FinancialYears.Commands.CreateFinancialYear;

/// <summary>
/// Command to create a new financial year.
/// </summary>
public record CreateFinancialYearCommand(
    string Name,
    DateOnly StartDate,
    DateOnly EndDate,
    bool IsCurrent = false) : IRequest<ApiResponse<FinancialYearDto>>;
