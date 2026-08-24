using MediatR;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetHeadcountByDepartment;

/// <summary>
/// Query to get departmental headcount distribution for the dashboard charts.
/// </summary>
public record GetHeadcountByDepartmentQuery(int CompanyId) : IRequest<ApiResponse<IReadOnlyList<DepartmentHeadcountDto>>>;

/// <summary>
/// Handler for <see cref="GetHeadcountByDepartmentQuery"/>.
/// </summary>
public class GetHeadcountByDepartmentQueryHandler : IRequestHandler<GetHeadcountByDepartmentQuery, ApiResponse<IReadOnlyList<DepartmentHeadcountDto>>>
{
    private readonly IAnalyticsRepository _analyticsRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetHeadcountByDepartmentQueryHandler"/> class.
    /// </summary>
    public GetHeadcountByDepartmentQueryHandler(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<DepartmentHeadcountDto>>> Handle(GetHeadcountByDepartmentQuery request, CancellationToken ct)
    {
        var dict = await _analyticsRepository.GetHeadcountByDepartmentAsync(request.CompanyId, ct);
        var list = dict.Select(kv => new DepartmentHeadcountDto(kv.Key, kv.Value)).ToList();
        return ApiResponse<IReadOnlyList<DepartmentHeadcountDto>>.Success(list);
    }
}
