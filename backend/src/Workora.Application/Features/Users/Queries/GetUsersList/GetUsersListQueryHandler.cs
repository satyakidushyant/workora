using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Users.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Queries.GetUsersList;

/// <summary>
/// Handler for <see cref="GetUsersListQuery"/>.
/// </summary>
public class GetUsersListQueryHandler : IRequestHandler<GetUsersListQuery, ApiResponse<PagedResponse<UserDto>>>
{
    private readonly IUserRepository _userRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetUsersListQueryHandler"/> class.
    /// </summary>
    /// <param name="userRepository">The user repository.</param>
    /// <param name="employeeRepository">The employee repository.</param>
    /// <param name="currentUserService">The current user service.</param>
    /// <param name="mapper">The mapper instance.</param>
    public GetUsersListQueryHandler(
        IUserRepository userRepository,
        IEmployeeRepository employeeRepository,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _employeeRepository = employeeRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<UserDto>>> Handle(GetUsersListQuery request, CancellationToken ct)
    {
        int? targetCompanyId = request.CompanyId;

        // If not specified and user is not SuperAdmin, automatically scope to the user's company
        if (!targetCompanyId.HasValue && _currentUserService.UserId.HasValue && !_currentUserService.IsInRole("SuperAdmin"))
        {
            var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
            if (user != null && user.EmployeeId.HasValue)
            {
                var employee = await _employeeRepository.GetWithFullDetailsAsync(user.EmployeeId.Value, ct);
                if (employee != null)
                {
                    targetCompanyId = employee.Department?.CompanyId ?? employee.Branch?.CompanyId;
                }
            }
        }

        var users = await _userRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            request.IsActive,
            targetCompanyId,
            ct);

        var totalCount = await _userRepository.GetCountAsync(
            request.SearchTerm,
            request.IsActive,
            targetCompanyId,
            ct);

        var dtos = _mapper.Map<List<UserDto>>(users);

        var pagedResponse = new PagedResponse<UserDto>
        {
            Items = dtos,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };

        return ApiResponse<PagedResponse<UserDto>>.Success(pagedResponse);
    }
}
