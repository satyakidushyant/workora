using AutoMapper;
using MediatR;
using Workora.Application.Features.FieldTracking.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.Queries.GetEmployeeVisitHistory;

/// <summary>
/// Handler for <see cref="GetEmployeeVisitHistoryQuery"/>.
/// </summary>
public class GetEmployeeVisitHistoryQueryHandler : IRequestHandler<GetEmployeeVisitHistoryQuery, ApiResponse<List<FieldVisitDto>>>
{
    private readonly IFieldVisitRepository _fieldVisitRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public GetEmployeeVisitHistoryQueryHandler(IFieldVisitRepository fieldVisitRepository, IMapper mapper)
    {
        _fieldVisitRepository = fieldVisitRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<List<FieldVisitDto>>> Handle(GetEmployeeVisitHistoryQuery request, CancellationToken ct)
    {
        var visits = await _fieldVisitRepository.GetVisitsByEmployeeAsync(request.EmployeeId, request.FromDate, request.ToDate, ct);
        var dtos = _mapper.Map<List<FieldVisitDto>>(visits);
        return ApiResponse<List<FieldVisitDto>>.Success(dtos);
    }
}
