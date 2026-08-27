using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetMyEmployeeProfile;

/// <summary>
/// Handler for <see cref="GetMyEmployeeProfileQuery"/>.
/// </summary>
public class GetMyEmployeeProfileQueryHandler : IRequestHandler<GetMyEmployeeProfileQuery, ApiResponse<EmployeeDetailDto>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetMyEmployeeProfileQueryHandler"/> class.
    /// </summary>
    public GetMyEmployeeProfileQueryHandler(
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<EmployeeDetailDto>> Handle(GetMyEmployeeProfileQuery request, CancellationToken ct)
    {
        if (_currentUserService.UserId == null)
        {
            return ApiResponse<EmployeeDetailDto>.Fail(ResponseMessage.UserContextUnavailable.GetDescription());
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<EmployeeDetailDto>.Fail(ResponseMessage.UserNotFound.GetDescription());
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<EmployeeDetailDto>.Fail(ResponseMessage.NoEmployeeLinkedToUser.GetDescription());
        }

        var dto = _mapper.Map<EmployeeDetailDto>(employee);
        return ApiResponse<EmployeeDetailDto>.Success(dto);
    }
}
