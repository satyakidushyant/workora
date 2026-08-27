using AutoMapper;
using MediatR;
using Workora.Application.Features.FieldTracking.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.Queries.GetFieldLiveLocations;

/// <summary>
/// Handler for <see cref="GetFieldLiveLocationsQuery"/>.
/// </summary>
public class GetFieldLiveLocationsQueryHandler : IRequestHandler<GetFieldLiveLocationsQuery, ApiResponse<List<LiveLocationDto>>>
{
    private readonly IFieldVisitRepository _fieldVisitRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public GetFieldLiveLocationsQueryHandler(IFieldVisitRepository fieldVisitRepository, IMapper mapper)
    {
        _fieldVisitRepository = fieldVisitRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<List<LiveLocationDto>>> Handle(GetFieldLiveLocationsQuery request, CancellationToken ct)
    {
        var pings = await _fieldVisitRepository.GetLatestGpsLocationsAsync(ct);
        var dtos = _mapper.Map<List<LiveLocationDto>>(pings);
        return ApiResponse<List<LiveLocationDto>>.Success(dtos);
    }
}
