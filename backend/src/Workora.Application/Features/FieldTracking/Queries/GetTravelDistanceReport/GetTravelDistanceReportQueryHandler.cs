using MediatR;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.FieldTracking.DTOs;
namespace Workora.Application.Features.FieldTracking.Queries.GetTravelDistanceReport;

/// <summary>
/// Handler for <see cref="GetTravelDistanceReportQuery"/>.
/// </summary>
public class GetTravelDistanceReportQueryHandler : IRequestHandler<GetTravelDistanceReportQuery, ApiResponse<TravelDistanceSummaryDto>>
{
    private readonly IFieldVisitRepository _fieldVisitRepository;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public GetTravelDistanceReportQueryHandler(IFieldVisitRepository fieldVisitRepository)
    {
        _fieldVisitRepository = fieldVisitRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TravelDistanceSummaryDto>> Handle(GetTravelDistanceReportQuery request, CancellationToken ct)
    {
        var visits = await _fieldVisitRepository.GetVisitsByEmployeeAsync(request.EmployeeId, request.FromDate, request.ToDate, ct);
        var totalKm = visits.Sum(x => x.DistanceTraveledKm);
        var summary = new TravelDistanceSummaryDto(request.EmployeeId, totalKm, visits.Count);
        return ApiResponse<TravelDistanceSummaryDto>.Success(summary);
    }
}
