using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.Commands.VerifyOnboardingItem;

/// <summary>
/// Handler for <see cref="VerifyOnboardingItemCommand"/>.
/// </summary>
public class VerifyOnboardingItemCommandHandler : IRequestHandler<VerifyOnboardingItemCommand, ApiResponse<bool>>
{
    private readonly IOnboardingRepository _onboardingRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="VerifyOnboardingItemCommandHandler"/> class.
    /// </summary>
    public VerifyOnboardingItemCommandHandler(
        IOnboardingRepository onboardingRepository,
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _onboardingRepository = onboardingRepository;
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(VerifyOnboardingItemCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var onboarding = await _onboardingRepository.GetEmployeeOnboardingItemAsync(request.EmployeeId, request.ChecklistId, ct);
        if (onboarding == null)
        {
            return ApiResponse<bool>.Fail("No onboarding record found for this employee and checklist item.");
        }

        if (onboarding.IsCompleted)
        {
            return ApiResponse<bool>.Fail("This onboarding item is already verified.");
        }

        var verifierEmpId = 0;
        if (_currentUserService.UserId.HasValue)
        {
            var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
            if (user != null)
            {
                var emp = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
                if (emp != null) verifierEmpId = emp.Id;
            }
        }

        onboarding.Verify(verifierEmpId);
        _onboardingRepository.UpdateEmployeeOnboarding(onboarding);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.Updated.GetDescription());
    }
}
