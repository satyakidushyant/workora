using AutoMapper;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Queries.GetEmployeeGoals;

/// <summary>
/// Query to list performance goals/KPIs for an employee.
/// </summary>
public record GetEmployeeGoalsQuery(
    int EmployeeId,
    GoalStatus? Status = null) : IRequest<ApiResponse<IReadOnlyList<GoalDto>>>;

/// <summary>
/// Handler for <see cref="GetEmployeeGoalsQuery"/>.
/// </summary>
public class GetEmployeeGoalsQueryHandler : IRequestHandler<GetEmployeeGoalsQuery, ApiResponse<IReadOnlyList<GoalDto>>>
{
    private readonly IPerformanceRepository _performanceRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEmployeeGoalsQueryHandler"/> class.
    /// </summary>
    public GetEmployeeGoalsQueryHandler(IPerformanceRepository performanceRepository, IMapper mapper)
    {
        _performanceRepository = performanceRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<GoalDto>>> Handle(GetEmployeeGoalsQuery request, CancellationToken ct)
    {
        var goals = await _performanceRepository.GetEmployeeGoalsAsync(request.EmployeeId, request.Status, ct);
        var dtos = _mapper.Map<IReadOnlyList<GoalDto>>(goals);
        return ApiResponse<IReadOnlyList<GoalDto>>.Success(dtos);
    }
}
