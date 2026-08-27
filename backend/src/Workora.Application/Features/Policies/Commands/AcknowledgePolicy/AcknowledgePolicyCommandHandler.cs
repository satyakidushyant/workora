using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Policies.DTOs;
namespace Workora.Application.Features.Policies.Commands.AcknowledgePolicy;

/// <summary>
/// Handler for <see cref="AcknowledgePolicyCommand"/>.
/// </summary>
public class AcknowledgePolicyCommandHandler : IRequestHandler<AcknowledgePolicyCommand, ApiResponse<bool>>
{
    private readonly IPolicyRepository _policyRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="AcknowledgePolicyCommandHandler"/> class.
    /// </summary>
    public AcknowledgePolicyCommandHandler(
        IPolicyRepository policyRepository,
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _policyRepository = policyRepository;
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(AcknowledgePolicyCommand request, CancellationToken ct)
    {
        if (!_currentUserService.UserId.HasValue)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.UserContextUnavailable.GetDescription());
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.UserNotFound.GetDescription());
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var policy = await _policyRepository.GetByIdAsync(request.Id, ct);
        if (policy == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.PolicyNotFound.GetDescription());
        }

        var alreadyAcknowledged = await _policyRepository.HasAcknowledgedAsync(policy.Id, employee.Id, ct);
        if (alreadyAcknowledged)
        {
            return ApiResponse<bool>.Success(true, ResponseMessage.PolicyAlreadyAcknowledged.GetDescription());
        }

        var ack = PolicyAcknowledgment.Create(policy.Id, employee.Id);
        await _policyRepository.AddAcknowledgmentAsync(ack, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.PolicyAcknowledged.GetDescription());
    }
}
