using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Shifts.Rosters;

/// <summary>
/// DTO representing an employee's monthly shift roster assignment schedule.
/// </summary>
public class EmployeeRosterDto
{
    /// <summary>
    /// Gets or sets employee ID.
    /// </summary>
    public int EmployeeId { get; set; }

    /// <summary>
    /// Gets or sets employee code.
    /// </summary>
    public string EmployeeCode { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets assigned shift ID.
    /// </summary>
    public int ShiftId { get; set; }

    /// <summary>
    /// Gets or sets assigned shift name (e.g. Morning, Night, General).
    /// </summary>
    public string ShiftName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets effective start date.
    /// </summary>
    public DateOnly EffectiveFrom { get; set; }

    /// <summary>
    /// Gets or sets effective end date.
    /// </summary>
    public DateOnly? EffectiveTo { get; set; }
}

/// <summary>
/// Query to retrieve monthly rotational shift roster.
/// </summary>
public record GetMonthlyShiftRosterQuery(int CompanyId, int Month, int Year) : IRequest<ApiResponse<IReadOnlyList<EmployeeRosterDto>>>;

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
    public async Task<ApiResponse<IReadOnlyList<EmployeeRosterDto>>> Handle(GetMonthlyShiftRosterQuery request, CancellationToken cancellationToken)
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

        return ApiResponse<IReadOnlyList<EmployeeRosterDto>>.Success(assignments, "Monthly shift roster schedule retrieved successfully.");
    }
}

/// <summary>
/// Command to bulk assign rotational shift roster for a group of employees.
/// </summary>
public record AssignRotationalRosterCommand(
    List<int> EmployeeIds,
    int ShiftId,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo = null) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Handler for <see cref="AssignRotationalRosterCommand"/>.
/// </summary>
public class AssignRotationalRosterCommandHandler : IRequestHandler<AssignRotationalRosterCommand, ApiResponse<bool>>
{
    private readonly IGenericRepository<EmployeeShiftAssignment> _assignmentRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="AssignRotationalRosterCommandHandler"/> class.
    /// </summary>
    public AssignRotationalRosterCommandHandler(
        IGenericRepository<EmployeeShiftAssignment> assignmentRepository,
        IUnitOfWork unitOfWork)
    {
        _assignmentRepository = assignmentRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Handles bulk rotational shift roster assignment.
    /// </summary>
    public async Task<ApiResponse<bool>> Handle(AssignRotationalRosterCommand request, CancellationToken cancellationToken)
    {
        foreach (var empId in request.EmployeeIds)
        {
            var assignment = EmployeeShiftAssignment.Create(empId, request.ShiftId, request.EffectiveFrom, request.EffectiveTo);
            await _assignmentRepository.AddAsync(assignment, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return ApiResponse<bool>.Success(true, $"Rotational shift assigned to {request.EmployeeIds.Count} employees successfully.");
    }
}

/// <summary>
/// Command to swap assigned shift rosters between two employees.
/// </summary>
public record SwapEmployeeShiftsCommand(
    int EmployeeId1,
    int EmployeeId2,
    DateOnly SwapDate) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Handler for <see cref="SwapEmployeeShiftsCommand"/>.
/// </summary>
public class SwapEmployeeShiftsCommandHandler : IRequestHandler<SwapEmployeeShiftsCommand, ApiResponse<bool>>
{
    private readonly IGenericRepository<EmployeeShiftAssignment> _assignmentRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="SwapEmployeeShiftsCommandHandler"/> class.
    /// </summary>
    public SwapEmployeeShiftsCommandHandler(
        IGenericRepository<EmployeeShiftAssignment> assignmentRepository,
        IUnitOfWork unitOfWork)
    {
        _assignmentRepository = assignmentRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Handles shift swap logic between two employees.
    /// </summary>
    public async Task<ApiResponse<bool>> Handle(SwapEmployeeShiftsCommand request, CancellationToken cancellationToken)
    {
        var a1 = await _assignmentRepository.GetFirstOrDefaultAsync(a => a.EmployeeId == request.EmployeeId1 && a.IsActive, cancellationToken);
        var a2 = await _assignmentRepository.GetFirstOrDefaultAsync(a => a.EmployeeId == request.EmployeeId2 && a.IsActive, cancellationToken);

        if (a1 == null || a2 == null)
        {
            return ApiResponse<bool>.Fail("Active shift assignments not found for one or both target employees.");
        }

        int shift1 = a1.ShiftId;
        int shift2 = a2.ShiftId;

        a1.EndAssignment(request.SwapDate);
        a2.EndAssignment(request.SwapDate);

        var newA1 = EmployeeShiftAssignment.Create(request.EmployeeId1, shift2, request.SwapDate);
        var newA2 = EmployeeShiftAssignment.Create(request.EmployeeId2, shift1, request.SwapDate);

        await _assignmentRepository.AddAsync(newA1, cancellationToken);
        await _assignmentRepository.AddAsync(newA2, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return ApiResponse<bool>.Success(true, "Employee shift assignments swapped successfully.");
    }
}
