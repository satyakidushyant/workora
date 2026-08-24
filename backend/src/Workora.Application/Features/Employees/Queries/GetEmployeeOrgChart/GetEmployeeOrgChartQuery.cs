using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeeOrgChart;

/// <summary>
/// Query to retrieve an employee's organizational hierarchy and direct reports.
/// </summary>
public record GetEmployeeOrgChartQuery(int Id) : IRequest<ApiResponse<OrgChartNodeDto>>;

/// <summary>
/// Handler for <see cref="GetEmployeeOrgChartQuery"/>.
/// </summary>
public class GetEmployeeOrgChartQueryHandler : IRequestHandler<GetEmployeeOrgChartQuery, ApiResponse<OrgChartNodeDto>>
{
    private readonly IEmployeeRepository _employeeRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEmployeeOrgChartQueryHandler"/> class.
    /// </summary>
    public GetEmployeeOrgChartQueryHandler(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<OrgChartNodeDto>> Handle(GetEmployeeOrgChartQuery request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetWithFullDetailsAsync(request.Id, ct);
        if (employee == null)
        {
            return ApiResponse<OrgChartNodeDto>.Fail("Employee not found.");
        }

        var directReports = await _employeeRepository.GetDirectReportsAsync(employee.Id, ct);

        var directReportsNodes = directReports.Select(dr => new OrgChartNodeDto(
            dr.Id,
            dr.EmployeeCode,
            $"{dr.FirstName} {dr.LastName}".Trim(),
            dr.Designation?.Title,
            dr.Department?.Name,
            dr.ManagerId,
            new List<OrgChartNodeDto>()
        )).ToList();

        var rootNode = new OrgChartNodeDto(
            employee.Id,
            employee.EmployeeCode,
            $"{employee.FirstName} {employee.LastName}".Trim(),
            employee.Designation?.Title,
            employee.Department?.Name,
            employee.ManagerId,
            directReportsNodes
        );

        return ApiResponse<OrgChartNodeDto>.Success(rootNode);
    }
}
