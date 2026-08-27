using MediatR;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetUpcomingLeaves;

/// <summary>
/// Handler for <see cref="GetUpcomingLeavesQuery"/>.
/// </summary>
public class GetUpcomingLeavesQueryHandler : IRequestHandler<GetUpcomingLeavesQuery, ApiResponse<IReadOnlyList<UpcomingLeaveDto>>>
{
    private readonly IAnalyticsRepository _analyticsRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetUpcomingLeavesQueryHandler"/> class.
    /// </summary>
    public GetUpcomingLeavesQueryHandler(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<UpcomingLeaveDto>>> Handle(GetUpcomingLeavesQuery request, CancellationToken ct)
    {
        var leaves = await _analyticsRepository.GetUpcomingLeavesAsync(request.CompanyId, request.DaysAhead, ct);

        var dtos = leaves.Select(l => new UpcomingLeaveDto(
            l.Id,
            l.EmployeeId,
            l.Employee != null ? $"{l.Employee.FirstName} {l.Employee.LastName}".Trim() : string.Empty,
            l.LeaveType != null ? l.LeaveType.Name : string.Empty,
            l.StartDate,
            l.EndDate,
            l.DaysCount)).ToList();

        return ApiResponse<IReadOnlyList<UpcomingLeaveDto>>.Success(dtos);
    }
}
