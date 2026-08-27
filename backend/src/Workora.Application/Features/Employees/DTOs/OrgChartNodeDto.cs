using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.DTOs;

/// <summary>
/// Org chart tree node DTO.
/// </summary>
public class OrgChartNodeDto
{
    /// <summary>Default constructor.</summary>
    public OrgChartNodeDto() { }

    /// <summary>Parameterized constructor.</summary>
    public OrgChartNodeDto(int id, string employeeCode, string fullName, string? designationTitle, string? departmentName, int? managerId, List<OrgChartNodeDto> directReports)
    {
        Id = id;
        EmployeeCode = employeeCode;
        FullName = fullName;
        DesignationTitle = designationTitle;
        DepartmentName = departmentName;
        ManagerId = managerId;
        DirectReports = directReports;
    }

    /// <summary>Employee ID.</summary>
    public int Id { get; set; }

    /// <summary>Employee code.</summary>
    public string EmployeeCode { get; set; } = string.Empty;

    /// <summary>Full name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>Designation title.</summary>
    public string? DesignationTitle { get; set; }

    /// <summary>Department name.</summary>
    public string? DepartmentName { get; set; }

    /// <summary>Reporting manager ID.</summary>
    public int? ManagerId { get; set; }

    /// <summary>Subordinate direct reports.</summary>
    public List<OrgChartNodeDto> DirectReports { get; set; } = new();
}
