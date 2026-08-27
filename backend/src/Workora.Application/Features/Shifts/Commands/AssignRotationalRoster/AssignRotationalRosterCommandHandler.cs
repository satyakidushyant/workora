using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.AssignRotationalRoster;

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
