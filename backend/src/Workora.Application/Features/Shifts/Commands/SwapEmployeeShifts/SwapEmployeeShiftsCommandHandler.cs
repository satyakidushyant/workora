using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.SwapEmployeeShifts;

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
