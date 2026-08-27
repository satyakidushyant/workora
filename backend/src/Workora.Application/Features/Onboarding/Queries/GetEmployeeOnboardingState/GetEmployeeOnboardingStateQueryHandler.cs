using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.Queries.GetEmployeeOnboardingState;

/// <summary>
/// Handler for <see cref="GetEmployeeOnboardingStateQuery"/>.
/// </summary>
public class GetEmployeeOnboardingStateQueryHandler : IRequestHandler<GetEmployeeOnboardingStateQuery, ApiResponse<EmployeeOnboardingStateDto>>
{
    private readonly IOnboardingRepository _onboardingRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEmployeeOnboardingStateQueryHandler"/> class.
    /// </summary>
    public GetEmployeeOnboardingStateQueryHandler(
        IOnboardingRepository onboardingRepository,
        IEmployeeRepository employeeRepository,
        IMapper mapper)
    {
        _onboardingRepository = onboardingRepository;
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<EmployeeOnboardingStateDto>> Handle(GetEmployeeOnboardingStateQuery request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<EmployeeOnboardingStateDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var items = await _onboardingRepository.GetEmployeeOnboardingAsync(request.EmployeeId, ct);
        var dtos = _mapper.Map<List<EmployeeOnboardingItemDto>>(items);

        var totalItems = dtos.Count;
        var completedItems = dtos.Count(i => i.IsCompleted);
        var pendingItems = totalItems - completedItems;
        var completionPercentage = totalItems > 0 ? Math.Round((decimal)completedItems / totalItems * 100, 1) : 0;

        var state = new EmployeeOnboardingStateDto(
            employee.Id,
            $"{employee.FirstName} {employee.LastName}",
            employee.EmployeeCode,
            totalItems,
            completedItems,
            pendingItems,
            completionPercentage,
            dtos);

        return ApiResponse<EmployeeOnboardingStateDto>.Success(state);
    }
}
