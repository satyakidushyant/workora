using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeesList;

/// <summary>
/// Handler for <see cref="GetEmployeesListQuery"/>.
/// </summary>
public class GetEmployeesListQueryHandler : IRequestHandler<GetEmployeesListQuery, ApiResponse<PagedResponse<EmployeeDto>>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEmployeesListQueryHandler"/> class.
    /// </summary>
    public GetEmployeesListQueryHandler(
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
    public async Task<ApiResponse<PagedResponse<EmployeeDto>>> Handle(GetEmployeesListQuery request, CancellationToken ct)
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

        var employees = await _employeeRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            request.DepartmentId,
            request.DesignationId,
            request.BranchId,
            request.Status,
            targetCompanyId,
            ct);

        var totalCount = await _employeeRepository.GetCountAsync(
            request.SearchTerm,
            request.DepartmentId,
            request.DesignationId,
            request.BranchId,
            request.Status,
            targetCompanyId,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<EmployeeDto>>(employees);
        var paged = new PagedResponse<EmployeeDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<EmployeeDto>>.Success(paged);
    }
}
