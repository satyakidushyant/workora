using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeesList;

/// <summary>
/// Handler for <see cref="GetEmployeesListQuery"/>.
/// </summary>
public class GetEmployeesListQueryHandler : IRequestHandler<GetEmployeesListQuery, ApiResponse<PagedResponse<EmployeeDto>>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEmployeesListQueryHandler"/> class.
    /// </summary>
    public GetEmployeesListQueryHandler(
        IEmployeeRepository employeeRepository,
        ITenantResolutionService tenantResolutionService,
        IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _tenantResolutionService = tenantResolutionService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<EmployeeDto>>> Handle(GetEmployeesListQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);

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
