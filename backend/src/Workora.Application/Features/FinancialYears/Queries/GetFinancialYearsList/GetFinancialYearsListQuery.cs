using AutoMapper;
using MediatR;
using Workora.Application.Features.FinancialYears.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FinancialYears.Queries.GetFinancialYearsList;

/// <summary>
/// Query to retrieve all financial years for a company.
/// </summary>
public record GetFinancialYearsListQuery() : IRequest<ApiResponse<IReadOnlyList<FinancialYearDto>>>;
