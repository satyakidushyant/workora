using AutoMapper;
using MediatR;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.Commands.CancelOvertimeRequest;

/// <summary>
/// Handler for <see cref="CancelOvertimeRequestCommand"/>.
/// </summary>
public class CancelOvertimeRequestCommandHandler : IRequestHandler<CancelOvertimeRequestCommand, ApiResponse<OvertimeRequestDto>>
{
    private readonly IOvertimeRequestRepository _overtimeRequestRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CancelOvertimeRequestCommandHandler"/> class.
    /// </summary>
    public CancelOvertimeRequestCommandHandler(
        IOvertimeRequestRepository overtimeRequestRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _overtimeRequestRepository = overtimeRequestRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<OvertimeRequestDto>> Handle(CancelOvertimeRequestCommand request, CancellationToken ct)
    {
        var overtimeRequest = await _overtimeRequestRepository.GetWithDetailsAsync(request.Id, ct);
        if (overtimeRequest == null)
        {
            return ApiResponse<OvertimeRequestDto>.Fail(ResponseMessage.NotFound.GetDescription());
        }

        if (overtimeRequest.Status == OvertimeRequestStatus.Cancelled || overtimeRequest.Status == OvertimeRequestStatus.Rejected)
        {
            return ApiResponse<OvertimeRequestDto>.Fail(ResponseMessage.OvertimeRequestAlreadyClosed.GetDescription());
        }

        if (overtimeRequest.Status == OvertimeRequestStatus.Approved)
        {
            return ApiResponse<OvertimeRequestDto>.Fail(ResponseMessage.OvertimeApprovedCannotCancel.GetDescription());
        }

        overtimeRequest.Cancel();

        _overtimeRequestRepository.Update(overtimeRequest);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<OvertimeRequestDto>(overtimeRequest);
        return ApiResponse<OvertimeRequestDto>.Success(dto, ResponseMessage.Updated.GetDescription());
    }
}
