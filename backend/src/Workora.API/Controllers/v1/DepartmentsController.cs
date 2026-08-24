using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Departments.Commands.AssignDepartmentHead;
using Workora.Application.Features.Departments.Commands.CreateDepartment;
using Workora.Application.Features.Departments.Commands.DeleteDepartment;
using Workora.Application.Features.Departments.Commands.UpdateDepartment;
using Workora.Application.Features.Departments.DTOs;
using Workora.Application.Features.Departments.Queries.GetDepartmentById;
using Workora.Application.Features.Departments.Queries.GetDepartmentsList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing organizational departments.
/// </summary>
[ApiController]
[Route("api/v1/departments")]
public class DepartmentsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="DepartmentsController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public DepartmentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a paginated list of departments.
    /// </summary>
    /// <param name="query">The search and pagination query parameters.</param>
    /// <returns>A paginated list of departments.</returns>
    [HttpGet]
    [Authorize(Policy = "departments.view")]
    public async Task<ApiResponse<PagedResponse<DepartmentDto>>> GetDepartments([FromQuery] GetDepartmentsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets detailed information for a single department including designations.
    /// </summary>
    /// <param name="id">The department ID.</param>
    /// <returns>The department details.</returns>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "departments.view")]
    public async Task<ApiResponse<DepartmentDetailDto>> GetDepartmentById(int id)
        => await _mediator.Send(new GetDepartmentByIdQuery(id));

    /// <summary>
    /// Creates a new department.
    /// </summary>
    /// <param name="command">The create department command payload.</param>
    /// <returns>The newly created department.</returns>
    [HttpPost]
    [Authorize(Policy = "departments.create")]
    public async Task<ApiResponse<DepartmentDto>> CreateDepartment([FromBody] CreateDepartmentCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates an existing department.
    /// </summary>
    /// <param name="id">The department ID.</param>
    /// <param name="command">The update department command payload.</param>
    /// <returns>The updated department.</returns>
    [HttpPut("{id:int}")]
    [Authorize(Policy = "departments.update")]
    public async Task<ApiResponse<DepartmentDto>> UpdateDepartment(int id, [FromBody] UpdateDepartmentCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Assigns or updates the department head.
    /// </summary>
    /// <param name="id">The department ID.</param>
    /// <param name="command">The assign head command payload.</param>
    /// <returns>The updated department.</returns>
    [HttpPatch("{id:int}/assign-head")]
    [Authorize(Policy = "departments.update")]
    public async Task<ApiResponse<DepartmentDto>> AssignDepartmentHead(int id, [FromBody] AssignDepartmentHeadCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Deletes a department.
    /// </summary>
    /// <param name="id">The department ID.</param>
    /// <returns>A confirmation response.</returns>
    [HttpDelete("{id:int}")]
    [Authorize(Policy = "departments.delete")]
    public async Task<ApiResponse<bool>> DeleteDepartment(int id)
        => await _mediator.Send(new DeleteDepartmentCommand(id));
}
