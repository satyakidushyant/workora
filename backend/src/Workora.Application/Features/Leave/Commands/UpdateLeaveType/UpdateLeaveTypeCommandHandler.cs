using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.UpdateLeaveType;

/// <summary>
/// Handler for <see cref="UpdateLeaveTypeCommand"/>.
/// </summary>
public class UpdateLeaveTypeCommandHandler : IRequestHandler<UpdateLeaveTypeCommand, ApiResponse<LeaveTypeDto>>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateLeaveTypeCommandHandler"/> class.
    /// </summary>
    public UpdateLeaveTypeCommandHandler(
        ILeaveRequestRepository leaveRequestRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<LeaveTypeDto>> Handle(UpdateLeaveTypeCommand request, CancellationToken ct)
    {
        var leaveType = await _leaveRequestRepository.GetLeaveTypeByIdAsync(request.Id, ct);
        if (leaveType == null)
        {
            return ApiResponse<LeaveTypeDto>.Fail(ResponseMessage.LeaveTypeNotFound.GetDescription());
        }

        leaveType.Update(
            request.Name,
            request.Code,
            request.AnnualQuota,
            request.RequiresHrApproval,
            request.AllowNegativeBalance,
            request.Description);

        _leaveRequestRepository.UpdateLeaveType(leaveType);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<LeaveTypeDto>(leaveType);
        return ApiResponse<LeaveTypeDto>.Success(dto, ResponseMessage.LeaveTypeUpdated.GetDescription());
    }
}
