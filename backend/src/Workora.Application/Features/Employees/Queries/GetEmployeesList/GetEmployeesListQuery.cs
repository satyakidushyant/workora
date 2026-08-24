using AutoMapper;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeesList;

/// <summary>
/// Query to retrieve a paginated and filtered list of employees.
/// </summary>
public record GetEmployeesListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    string? SearchTerm = null,
    int? DepartmentId = null,
    int? DesignationId = null,
    int? BranchId = null,
    EmploymentStatus? Status = null) : IRequest<ApiResponse<PagedResponse<EmployeeDto>>>;

/// <summary>
/// Handler for <see cref="GetEmployeesListQuery"/>.
/// </summary>
public class GetEmployeesListQueryHandler : IRequestHandler<GetEmployeesListQuery, ApiResponse<PagedResponse<EmployeeDto>>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEmployeesListQueryHandler"/> class.
    /// </summary>
    public GetEmployeesListQueryHandler(IEmployeeRepository employeeRepository, IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<EmployeeDto>>> Handle(GetEmployeesListQuery request, CancellationToken ct)
    {
        var employees = await _employeeRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            request.DepartmentId,
            request.DesignationId,
            request.BranchId,
            request.Status,
            ct);

        var totalCount = await _employeeRepository.GetCountAsync(
            request.SearchTerm,
            request.DepartmentId,
            request.DesignationId,
            request.BranchId,
            request.Status,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<EmployeeDto>>(employees);
        var paged = new PagedResponse<EmployeeDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<EmployeeDto>>.Success(paged);
    }
}
