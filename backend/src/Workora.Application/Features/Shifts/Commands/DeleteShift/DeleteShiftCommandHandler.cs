using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.DeleteShift;

/// <summary>
/// Handler for <see cref="DeleteShiftCommand"/>.
/// </summary>
public class DeleteShiftCommandHandler : IRequestHandler<DeleteShiftCommand, ApiResponse<bool>>
{
    private readonly IShiftRepository _shiftRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteShiftCommandHandler"/> class.
    /// </summary>
    public DeleteShiftCommandHandler(IShiftRepository shiftRepository, IUnitOfWork unitOfWork)
    {
        _shiftRepository = shiftRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(DeleteShiftCommand request, CancellationToken ct)
    {
        var shift = await _shiftRepository.GetByIdAsync(request.Id, ct);
        if (shift == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.ShiftNotFound.GetDescription());
        }

        _shiftRepository.Remove(shift);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.ShiftDeleted.GetDescription());
    }
}
