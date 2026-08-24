using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Payroll.Commands.ApprovePayrollRun;
using Workora.Application.Features.Payroll.Commands.AssignSalaryStructure;
using Workora.Application.Features.Payroll.Commands.CreatePayrollRun;
using Workora.Application.Features.Payroll.Commands.CreateSalaryStructure;
using Workora.Application.Features.Payroll.Commands.DisbursePayrollRun;
using Workora.Application.Features.Payroll.Commands.UpdateSalaryStructure;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Application.Features.Payroll.Queries.GetEmployeeSalaryStructure;
using Workora.Application.Features.Payroll.Queries.GetMyPayslips;
using Workora.Application.Features.Payroll.Queries.GetPayrollRunById;
using Workora.Application.Features.Payroll.Queries.GetPayrollRunsList;
using Workora.Application.Features.Payroll.Queries.GetPayslipById;
using Workora.Application.Features.Payroll.Queries.GetSalaryStructureById;
using Workora.Application.Features.Payroll.Queries.GetSalaryStructuresList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for salary compensation templates, employee assignments, monthly payroll cycles, and payslips.
/// </summary>
[ApiController]
[Route("api/v1/payroll")]
public class PayrollController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="PayrollController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public PayrollController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lists all salary structures for a company.
    /// </summary>
    /// <param name="companyId">The company ID.</param>
    /// <returns>A list of salary structures.</returns>
    [HttpGet("structures")]
    [Authorize(Policy = "payroll.manage")]
    public async Task<ApiResponse<IReadOnlyList<SalaryStructureDto>>> GetStructures([FromQuery] int companyId)
        => await _mediator.Send(new GetSalaryStructuresListQuery(companyId));

    /// <summary>
    /// Gets a specific salary structure by ID.
    /// </summary>
    /// <param name="id">The salary structure ID.</param>
    /// <returns>The salary structure details.</returns>
    [HttpGet("structures/{id:int}")]
    [Authorize(Policy = "payroll.manage")]
    public async Task<ApiResponse<SalaryStructureDto>> GetStructureById(int id)
        => await _mediator.Send(new GetSalaryStructureByIdQuery(id));

    /// <summary>
    /// Creates a new salary structure template with component breakdowns.
    /// </summary>
    /// <param name="command">The creation command payload.</param>
    /// <returns>The created salary structure.</returns>
    [HttpPost("structures")]
    [Authorize(Policy = "payroll.manage")]
    public async Task<ApiResponse<SalaryStructureDto>> CreateStructure([FromBody] CreateSalaryStructureCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates an existing salary structure template.
    /// </summary>
    /// <param name="id">The salary structure ID.</param>
    /// <param name="command">The update command payload.</param>
    /// <returns>The updated salary structure.</returns>
    [HttpPut("structures/{id:int}")]
    [Authorize(Policy = "payroll.manage")]
    public async Task<ApiResponse<SalaryStructureDto>> UpdateStructure(int id, [FromBody] UpdateSalaryStructureCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Assigns a salary structure and base rate to an employee.
    /// </summary>
    /// <param name="command">The assignment command payload.</param>
    /// <returns>A confirmation response.</returns>
    [HttpPost("assign-structure")]
    [Authorize(Policy = "payroll.manage")]
    public async Task<ApiResponse<bool>> AssignStructure([FromBody] AssignSalaryStructureCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Gets the current active salary compensation structure for an employee.
    /// </summary>
    /// <param name="employeeId">The employee ID.</param>
    /// <returns>The active salary assignment.</returns>
    [HttpGet("employee-structure/{employeeId:int}")]
    [Authorize(Policy = "payroll.view")]
    public async Task<ApiResponse<EmployeeSalaryAssignmentDto>> GetEmployeeStructure(int employeeId)
        => await _mediator.Send(new GetEmployeeSalaryStructureQuery(employeeId));

    /// <summary>
    /// Gets a paginated list of payroll run cycles.
    /// </summary>
    /// <param name="query">Pagination and status filter.</param>
    /// <returns>A paginated list of payroll runs.</returns>
    [HttpGet("runs")]
    [Authorize(Policy = "payroll.view")]
    public async Task<ApiResponse<PagedResponse<PayrollRunDto>>> GetRuns([FromQuery] GetPayrollRunsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets detailed information for a specific payroll run with all payslips.
    /// </summary>
    /// <param name="id">The payroll run ID.</param>
    /// <returns>The payroll run details.</returns>
    [HttpGet("runs/{id:int}")]
    [Authorize(Policy = "payroll.view")]
    public async Task<ApiResponse<PayrollRunDetailDto>> GetRunById(int id)
        => await _mediator.Send(new GetPayrollRunByIdQuery(id));

    /// <summary>
    /// Calculates and initiates a monthly payroll computation cycle.
    /// </summary>
    /// <param name="command">The payroll run command payload.</param>
    /// <returns>The calculated payroll run.</returns>
    [HttpPost("runs")]
    [Authorize(Policy = "payroll.manage")]
    public async Task<ApiResponse<PayrollRunDetailDto>> CreateRun([FromBody] CreatePayrollRunCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Approves a calculated payroll run.
    /// </summary>
    /// <param name="id">The payroll run ID.</param>
    /// <returns>The approved payroll run.</returns>
    [HttpPost("runs/{id:int}/approve")]
    [Authorize(Policy = "payroll.approve")]
    public async Task<ApiResponse<PayrollRunDto>> ApproveRun(int id)
        => await _mediator.Send(new ApprovePayrollRunCommand(id));

    /// <summary>
    /// Disburses payment for an approved payroll run.
    /// </summary>
    /// <param name="id">The payroll run ID.</param>
    /// <returns>The disbursed payroll run.</returns>
    [HttpPost("runs/{id:int}/disburse")]
    [Authorize(Policy = "payroll.disburse")]
    public async Task<ApiResponse<PayrollRunDto>> DisburseRun(int id)
        => await _mediator.Send(new DisbursePayrollRunCommand(id));

    /// <summary>
    /// Gets itemized breakdown details for a single payslip.
    /// </summary>
    /// <param name="id">The payslip ID.</param>
    /// <returns>The payslip details.</returns>
    [HttpGet("payslips/{id:int}")]
    [Authorize(Policy = "payroll.view")]
    public async Task<ApiResponse<PayslipDto>> GetPayslipById(int id)
        => await _mediator.Send(new GetPayslipByIdQuery(id));

    /// <summary>
    /// Retrieves all issued payslips for the authenticated employee.
    /// </summary>
    /// <param name="year">Optional calendar year filter.</param>
    /// <returns>A list of payslips.</returns>
    [HttpGet("my-payslips")]
    [Authorize(Policy = "payroll.self")]
    public async Task<ApiResponse<IReadOnlyList<PayslipDto>>> GetMyPayslips([FromQuery] int? year = null)
        => await _mediator.Send(new GetMyPayslipsQuery(year));
}
