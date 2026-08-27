using AutoMapper;
using MediatR;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Queries.GetHolidayById;

/// <summary>
/// Query to retrieve details of a specific holiday.
/// </summary>
public record GetHolidayByIdQuery(int Id) : IRequest<ApiResponse<HolidayDto>>;
