using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.UnassignShift;

/// <summary>
/// Handler for <see cref="UnassignShiftCommand"/>.
/// </summary>
public class UnassignShiftCommandHandler : IRequestHandler<UnassignShiftCommand, ApiResponse<bool>>
{
    private readonly IShiftRepository _shiftRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="UnassignShiftCommandHandler"/> class.
    /// </summary>
    public UnassignShiftCommandHandler(IShiftRepository shiftRepository, IUnitOfWork unitOfWork)
    {
        _shiftRepository = shiftRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(UnassignShiftCommand request, CancellationToken ct)
    {
        var activeAssignment = await _shiftRepository.GetActiveAssignmentAsync(request.EmployeeId, request.EffectiveTo, ct);
        if (activeAssignment == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.ShiftNoActiveAssignment.GetDescription());
        }

        activeAssignment.EndAssignment(request.EffectiveTo);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.ShiftUnassigned.GetDescription());
    }
}
