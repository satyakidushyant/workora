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

/// <summary>
/// Handler for <see cref="GetHolidaysListQuery"/>.
/// </summary>
public class GetHolidaysListQueryHandler : IRequestHandler<GetHolidaysListQuery, ApiResponse<IReadOnlyList<HolidayDto>>>
{
    private readonly IHolidayRepository _holidayRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetHolidaysListQueryHandler"/> class.
    /// </summary>
    public GetHolidaysListQueryHandler(IHolidayRepository holidayRepository, IMapper mapper)
    {
        _holidayRepository = holidayRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<HolidayDto>>> Handle(GetHolidaysListQuery request, CancellationToken ct)
    {
        var year = request.Year > 0 ? request.Year : DateTime.UtcNow.Year;
        var holidays = await _holidayRepository.GetHolidaysAsync(year, request.BranchId, request.CompanyId, ct);
        var dtos = _mapper.Map<IReadOnlyList<HolidayDto>>(holidays);
        return ApiResponse<IReadOnlyList<HolidayDto>>.Success(dtos);
    }
}
