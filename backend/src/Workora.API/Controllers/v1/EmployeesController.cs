using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Employees.Commands.CreateEmployee;
using Workora.Application.Features.Employees.Commands.ReactivateEmployee;
using Workora.Application.Features.Employees.Commands.TerminateEmployee;
using Workora.Application.Features.Employees.Commands.TransferEmployee;
using Workora.Application.Features.Employees.Commands.UpdateEmployee;
using Workora.Application.Features.Employees.Commands.UpdateMyEmployeeProfile;
using Workora.Application.Features.Employees.Commands.UpsertBankDetails;
using Workora.Application.Features.Employees.Commands.UpsertEmergencyContact;
using Workora.Application.Features.Employees.DTOs;
using Workora.Application.Features.Employees.Queries.ExportEmployees;
using Workora.Application.Features.Employees.Queries.GetEmployeeById;
using Workora.Application.Features.Employees.Queries.GetEmployeeDirectReports;
using Workora.Application.Features.Employees.Queries.GetEmployeeEmploymentHistory;
using Workora.Application.Features.Employees.Queries.GetEmployeeOrgChart;
using Workora.Application.Features.Employees.Queries.GetEmployeesList;
using Workora.Application.Features.Employees.Queries.GetMyEmployeeProfile;
using Workora.Application.Features.Employees.Commands.BulkImportEmployees;
using Workora.Application.Features.Employees.Commands.PromoteEmployee;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing the core employee directory, profiles, lifecycle, and org chart.
/// </summary>
[ApiController]
[Route("api/v1/employees")]
public class EmployeesController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="EmployeesController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public EmployeesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a paginated list of employees with optional filtering.
    /// </summary>
    /// <param name="query">The search, department, branch, and status filters.</param>
    /// <returns>A paginated list of employee summaries.</returns>
    [HttpGet]
    [Authorize(Policy = "employees.view")]
    public async Task<ApiResponse<PagedResponse<EmployeeDto>>> GetEmployees([FromQuery] GetEmployeesListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets the authenticated employee's own profile.
    /// </summary>
    /// <returns>The employee details.</returns>
    [HttpGet("me")]
    [Authorize]
    public async Task<ApiResponse<EmployeeDetailDto>> GetMyProfile()
        => await _mediator.Send(new GetMyEmployeeProfileQuery());

    /// <summary>
    /// Allows the authenticated employee to update their own contact information.
    /// </summary>
    /// <param name="command">The self-service update command payload.</param>
    /// <returns>The updated employee profile.</returns>
    [HttpPut("me")]
    [Authorize]
    public async Task<ApiResponse<EmployeeDetailDto>> UpdateMyProfile([FromBody] UpdateMyEmployeeProfileCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Exports the employee list based on criteria (CSV/Excel data payload).
    /// </summary>
    /// <param name="query">The filter query.</param>
    /// <returns>The list of employees.</returns>
    [HttpGet("export")]
    [Authorize(Policy = "employees.view")]
    public async Task<ApiResponse<IReadOnlyList<EmployeeDto>>> ExportEmployees([FromQuery] ExportEmployeesQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets full details for a specific employee by ID.
    /// </summary>
    /// <param name="id">The employee ID.</param>
    /// <returns>The employee detail DTO.</returns>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "employees.view")]
    public async Task<ApiResponse<EmployeeDetailDto>> GetEmployeeById(int id)
        => await _mediator.Send(new GetEmployeeByIdQuery(id));

    /// <summary>
    /// Onboards a new employee into the system.
    /// </summary>
    /// <param name="command">The create employee command payload.</param>
    /// <returns>The newly created employee.</returns>
    [HttpPost]
    [Authorize(Policy = "employees.create")]
    public async Task<ApiResponse<EmployeeDto>> CreateEmployee([FromBody] CreateEmployeeCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates an existing employee profile.
    /// </summary>
    /// <param name="id">The employee ID.</param>
    /// <param name="command">The update command payload.</param>
    /// <returns>The updated employee summary.</returns>
    [HttpPut("{id:int}")]
    [Authorize(Policy = "employees.update")]
    public async Task<ApiResponse<EmployeeDto>> UpdateEmployee(int id, [FromBody] UpdateEmployeeCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Transfers an employee to a different department, designation, or branch.
    /// </summary>
    /// <param name="id">The employee ID.</param>
    /// <param name="command">The transfer command payload.</param>
    /// <returns>The updated employee.</returns>
    [HttpPatch("{id:int}/transfer")]
    [Authorize(Policy = "employees.transfer")]
    public async Task<ApiResponse<EmployeeDto>> TransferEmployee(int id, [FromBody] TransferEmployeeCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Terminates an employee's employment.
    /// </summary>
    /// <param name="id">The employee ID.</param>
    /// <param name="command">The termination command payload.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPatch("{id:int}/terminate")]
    [Authorize(Policy = "employees.terminate")]
    public async Task<ApiResponse<bool>> TerminateEmployee(int id, [FromBody] TerminateEmployeeCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Reactivates a previously terminated employee.
    /// </summary>
    /// <param name="id">The employee ID.</param>
    /// <param name="command">The rehire command payload.</param>
    /// <returns>The reactivated employee.</returns>
    [HttpPatch("{id:int}/reactivate")]
    [Authorize(Policy = "employees.update")]
    public async Task<ApiResponse<EmployeeDto>> ReactivateEmployee(int id, [FromBody] ReactivateEmployeeCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Gets the organizational hierarchy reporting chain for an employee.
    /// </summary>
    /// <param name="id">The employee ID.</param>
    /// <returns>The org chart node tree.</returns>
    [HttpGet("{id:int}/org-chart")]
    [Authorize(Policy = "employees.view")]
    public async Task<ApiResponse<OrgChartNodeDto>> GetEmployeeOrgChart(int id)
        => await _mediator.Send(new GetEmployeeOrgChartQuery(id));

    /// <summary>
    /// Gets the career employment history for an employee.
    /// </summary>
    /// <param name="id">The employee ID.</param>
    /// <returns>A list of career transition events.</returns>
    [HttpGet("{id:int}/employment-history")]
    [Authorize(Policy = "employees.view")]
    public async Task<ApiResponse<IReadOnlyList<EmploymentHistoryDto>>> GetEmploymentHistory(int id)
        => await _mediator.Send(new GetEmployeeEmploymentHistoryQuery(id));

    /// <summary>
    /// Lists all direct subordinate reports for an employee.
    /// </summary>
    /// <param name="id">The manager's employee ID.</param>
    /// <returns>A list of reporting employees.</returns>
    [HttpGet("{id:int}/direct-reports")]
    [Authorize(Policy = "employees.view")]
    public async Task<ApiResponse<IReadOnlyList<EmployeeDto>>> GetDirectReports(int id)
        => await _mediator.Send(new GetEmployeeDirectReportsQuery(id));

    /// <summary>
    /// Adds or updates an emergency contact for an employee.
    /// </summary>
    /// <param name="id">The employee ID.</param>
    /// <param name="command">The contact command payload.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPost("{id:int}/emergency-contacts")]
    [Authorize(Policy = "employees.update")]
    public async Task<ApiResponse<bool>> UpsertEmergencyContact(int id, [FromBody] UpsertEmergencyContactCommand command)
        => await _mediator.Send(command with { EmployeeId = id });

    /// <summary>
    /// Creates or updates bank disbursement details for an employee.
    /// </summary>
    /// <param name="id">The employee ID.</param>
    /// <param name="command">The bank details command payload.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPut("{id:int}/bank-details")]
    [Authorize(Policy = "employees.update")]
    public async Task<ApiResponse<bool>> UpsertBankDetails(int id, [FromBody] UpsertBankDetailsCommand command)
        => await _mediator.Send(command with { EmployeeId = id });

    /// <summary>
    /// Bulk uploads new employee records into the system.
    /// </summary>
    /// <param name="command">The bulk employee payload.</param>
    /// <returns>Number of created employee records.</returns>
    [HttpPost("bulk-import")]
    [Authorize(Policy = "employees.create")]
    public async Task<ApiResponse<int>> BulkImport([FromBody] BulkImportEmployeesCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Promotes an employee to a new designation.
    /// </summary>
    /// <param name="id">The employee ID.</param>
    /// <param name="command">The promotion command payload.</param>
    /// <returns>The updated employee.</returns>
    [HttpPatch("{id:int}/promote")]
    [Authorize(Policy = "employees.update")]
    public async Task<ApiResponse<EmployeeDto>> PromoteEmployee(int id, [FromBody] PromoteEmployeeCommand command)
        => await _mediator.Send(command with { Id = id });
}
