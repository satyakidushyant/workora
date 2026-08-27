using AutoMapper;
using MediatR;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Queries.GetHolidaysList;

/// <summary>
/// Query to list holidays for a given year and optional branch.
/// </summary>
public record GetHolidaysListQuery(
    int Year,
    int? BranchId = null,
    int? CompanyId = null) : IRequest<ApiResponse<IReadOnlyList<HolidayDto>>>;
