using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Queries.GetDepartmentsList;

/// <summary>
/// Query to get a paginated list of departments.
/// </summary>
public record GetDepartmentsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    string? SearchTerm = null,
    int? CompanyId = null) : IRequest<ApiResponse<PagedResponse<DepartmentDto>>>;

/// <summary>
/// Handler for <see cref="GetDepartmentsListQuery"/>.
/// </summary>
public class GetDepartmentsListQueryHandler : IRequestHandler<GetDepartmentsListQuery, ApiResponse<PagedResponse<DepartmentDto>>>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUserRepository _userRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetDepartmentsListQueryHandler"/> class.
    /// </summary>
    public GetDepartmentsListQueryHandler(
        IDepartmentRepository departmentRepository,
        IUserRepository userRepository,
        IEmployeeRepository employeeRepository,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _departmentRepository = departmentRepository;
        _userRepository = userRepository;
        _employeeRepository = employeeRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<DepartmentDto>>> Handle(GetDepartmentsListQuery request, CancellationToken ct)
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

        var departments = await _departmentRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            targetCompanyId,
            ct);

        var totalCount = await _departmentRepository.GetCountAsync(
            request.SearchTerm,
            targetCompanyId,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<DepartmentDto>>(departments);
        var paged = new PagedResponse<DepartmentDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<DepartmentDto>>.Success(paged);
    }
}
