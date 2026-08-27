using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.Commands.ApproveOvertimeRequest;

/// <summary>
/// Handler for <see cref="ApproveOvertimeRequestCommand"/>.
/// </summary>
public class ApproveOvertimeRequestCommandHandler : IRequestHandler<ApproveOvertimeRequestCommand, ApiResponse<OvertimeRequestDto>>
{
    private readonly IOvertimeRequestRepository _overtimeRequestRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="ApproveOvertimeRequestCommandHandler"/> class.
    /// </summary>
    public ApproveOvertimeRequestCommandHandler(
        IOvertimeRequestRepository overtimeRequestRepository,
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _overtimeRequestRepository = overtimeRequestRepository;
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<OvertimeRequestDto>> Handle(ApproveOvertimeRequestCommand request, CancellationToken ct)
    {
        var overtimeRequest = await _overtimeRequestRepository.GetWithDetailsAsync(request.Id, ct);
        if (overtimeRequest == null)
        {
            return ApiResponse<OvertimeRequestDto>.Fail(ResponseMessage.NotFound.GetDescription());
        }

        if (overtimeRequest.Status != OvertimeRequestStatus.PendingManagerApproval &&
            overtimeRequest.Status != OvertimeRequestStatus.PendingHrApproval)
        {
            return ApiResponse<OvertimeRequestDto>.Fail(ResponseMessage.OvertimeOnlyPendingCanBeApproved.GetDescription());
        }

        var approverEmpId = 0;
        var role = "Manager";
        if (_currentUserService.UserId.HasValue)
        {
            var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
            if (user != null)
            {
                var emp = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
                if (emp != null) approverEmpId = emp.Id;
            }
        }

        var requiresSecondStage = overtimeRequest.Status == OvertimeRequestStatus.PendingManagerApproval;
        overtimeRequest.Approve(approverEmpId, role, requiresSecondStage, request.Comments);

        _overtimeRequestRepository.Update(overtimeRequest);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<OvertimeRequestDto>(overtimeRequest);
        return ApiResponse<OvertimeRequestDto>.Success(dto, ResponseMessage.Updated.GetDescription());
    }
}
