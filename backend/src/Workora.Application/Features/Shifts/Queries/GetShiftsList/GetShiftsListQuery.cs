using AutoMapper;
using MediatR;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Queries.GetShiftsList;

/// <summary>
/// Query to get a paginated list of shifts.
/// </summary>
public record GetShiftsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    string? SearchTerm = null,
    int? CompanyId = null) : IRequest<ApiResponse<PagedResponse<ShiftDto>>>;
