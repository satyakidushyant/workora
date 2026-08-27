using AutoMapper;
using MediatR;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Queries.GetShiftById;

/// <summary>
/// Handler for <see cref="GetShiftByIdQuery"/>.
/// </summary>
public class GetShiftByIdQueryHandler : IRequestHandler<GetShiftByIdQuery, ApiResponse<ShiftDto>>
{
    private readonly IShiftRepository _shiftRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetShiftByIdQueryHandler"/> class.
    /// </summary>
    public GetShiftByIdQueryHandler(IShiftRepository shiftRepository, IMapper mapper)
    {
        _shiftRepository = shiftRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<ShiftDto>> Handle(GetShiftByIdQuery request, CancellationToken ct)
    {
        var shift = await _shiftRepository.GetByIdAsync(request.Id, ct);
        if (shift == null)
        {
            return ApiResponse<ShiftDto>.Fail("Shift not found.");
        }

        var dto = _mapper.Map<ShiftDto>(shift);
        return ApiResponse<ShiftDto>.Success(dto);
    }
}
