using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetMyEmployeeProfile;

/// <summary>
/// Query to retrieve the currently logged in employee's profile.
/// </summary>
public record GetMyEmployeeProfileQuery : IRequest<ApiResponse<EmployeeDetailDto>>;

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
            return ApiResponse<EmployeeDetailDto>.Fail("User context not found.");
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<EmployeeDetailDto>.Fail("User account not found.");
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<EmployeeDetailDto>.Fail("No employee record is linked to this user account.");
        }

        var dto = _mapper.Map<EmployeeDetailDto>(employee);
        return ApiResponse<EmployeeDetailDto>.Success(dto);
    }
}
