using AutoMapper;
using MediatR;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Queries.GetHolidayById;

/// <summary>
/// Handler for <see cref="GetHolidayByIdQuery"/>.
/// </summary>
public class GetHolidayByIdQueryHandler : IRequestHandler<GetHolidayByIdQuery, ApiResponse<HolidayDto>>
{
    private readonly IHolidayRepository _holidayRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetHolidayByIdQueryHandler"/> class.
    /// </summary>
    public GetHolidayByIdQueryHandler(IHolidayRepository holidayRepository, IMapper mapper)
    {
        _holidayRepository = holidayRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<HolidayDto>> Handle(GetHolidayByIdQuery request, CancellationToken ct)
    {
        var holiday = await _holidayRepository.GetByIdAsync(request.Id, ct);
        if (holiday == null)
        {
            return ApiResponse<HolidayDto>.Fail("Holiday not found.");
        }

        var dto = _mapper.Map<HolidayDto>(holiday);
        return ApiResponse<HolidayDto>.Success(dto);
    }
}
