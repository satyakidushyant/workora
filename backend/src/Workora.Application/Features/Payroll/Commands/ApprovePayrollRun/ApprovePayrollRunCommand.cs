using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Commands.ApprovePayrollRun;

/// <summary>
/// Command to approve a calculated payroll run.
/// </summary>
public record ApprovePayrollRunCommand(int Id) : IRequest<ApiResponse<PayrollRunDto>>;

/// <summary>
/// Handler for <see cref="ApprovePayrollRunCommand"/>.
/// </summary>
public class ApprovePayrollRunCommandHandler : IRequestHandler<ApprovePayrollRunCommand, ApiResponse<PayrollRunDto>>
{
    private readonly IPayrollRepository _payrollRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="ApprovePayrollRunCommandHandler"/> class.
    /// </summary>
    public ApprovePayrollRunCommandHandler(
        IPayrollRepository payrollRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _payrollRepository = payrollRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PayrollRunDto>> Handle(ApprovePayrollRunCommand request, CancellationToken ct)
    {
        var run = await _payrollRepository.GetByIdAsync(request.Id, ct);
        if (run == null)
        {
            return ApiResponse<PayrollRunDto>.Fail(ResponseMessage.PayrollRunNotFound.GetDescription());
        }

        if (run.Status != PayrollStatus.Calculated)
        {
            return ApiResponse<PayrollRunDto>.Fail("Only calculated payroll runs can be approved.");
        }

        var approverUserId = 0;
        if (_currentUserService.UserId.HasValue)
        {
            var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
            if (user != null) approverUserId = user.Id;
        }

        run.Approve(approverUserId);
        _payrollRepository.Update(run);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<PayrollRunDto>(run);
        return ApiResponse<PayrollRunDto>.Success(dto, ResponseMessage.PayrollRunApproved.GetDescription());
    }
}
