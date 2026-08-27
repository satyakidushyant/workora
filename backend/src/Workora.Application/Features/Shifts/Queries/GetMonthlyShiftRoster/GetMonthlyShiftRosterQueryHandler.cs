using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Queries.GetMonthlyShiftRoster;

/// <summary>
/// Handler for <see cref="GetMonthlyShiftRosterQuery"/>.
/// </summary>
public class GetMonthlyShiftRosterQueryHandler : IRequestHandler<GetMonthlyShiftRosterQuery, ApiResponse<IReadOnlyList<EmployeeRosterDto>>>
{
    private readonly IGenericRepository<EmployeeShiftAssignment> _assignmentRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetMonthlyShiftRosterQueryHandler"/> class.
    /// </summary>
    public GetMonthlyShiftRosterQueryHandler(IGenericRepository<EmployeeShiftAssignment> assignmentRepository)
    {
        _assignmentRepository = assignmentRepository;
    }

    /// <summary>
    /// Handles fetching monthly shift roster assignments.
    /// </summary>
    public Task<ApiResponse<IReadOnlyList<EmployeeRosterDto>>> Handle(GetMonthlyShiftRosterQuery request, CancellationToken cancellationToken)
    {
        var assignments = _assignmentRepository.GetQueryable().ToList()
            .Where(a => a.IsActive)
            .Select(a => new EmployeeRosterDto
            {
                EmployeeId = a.EmployeeId,
                EmployeeCode = $"EMP-{a.EmployeeId}",
                ShiftId = a.ShiftId,
                ShiftName = "Rotational Shift",
                EffectiveFrom = a.EffectiveFrom,
                EffectiveTo = a.EffectiveTo
            })
            .ToList();

        return Task.FromResult(ApiResponse<IReadOnlyList<EmployeeRosterDto>>.Success(assignments, ResponseMessage.ShiftRosterRetrieved.GetDescription()));
    }
}
