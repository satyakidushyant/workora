using AutoMapper;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.ExportEmployees;

/// <summary>
/// Query to retrieve a filtered employee list for export purposes.
/// </summary>
public record ExportEmployeesQuery(
    string? SearchTerm = null,
    int? DepartmentId = null,
    int? DesignationId = null,
    int? BranchId = null,
    EmploymentStatus? Status = null) : IRequest<ApiResponse<IReadOnlyList<EmployeeDto>>>;

/// <summary>
/// Handler for <see cref="ExportEmployeesQuery"/>.
/// </summary>
public class ExportEmployeesQueryHandler : IRequestHandler<ExportEmployeesQuery, ApiResponse<IReadOnlyList<EmployeeDto>>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="ExportEmployeesQueryHandler"/> class.
    /// </summary>
    public ExportEmployeesQueryHandler(IEmployeeRepository employeeRepository, IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<EmployeeDto>>> Handle(ExportEmployeesQuery request, CancellationToken ct)
    {
        var employees = await _employeeRepository.GetExportListAsync(
            request.SearchTerm,
            request.DepartmentId,
            request.DesignationId,
            request.BranchId,
            request.Status,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<EmployeeDto>>(employees);
        return ApiResponse<IReadOnlyList<EmployeeDto>>.Success(dtos);
    }
}
