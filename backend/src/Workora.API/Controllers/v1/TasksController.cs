using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Tasks.Commands.AssignTask;
using Workora.Application.Features.Tasks.Commands.CreateTask;
using Workora.Application.Features.Tasks.Commands.DeleteTask;
using Workora.Application.Features.Tasks.Commands.UpdateTaskStatus;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Application.Features.Tasks.Queries.GetTaskById;
using Workora.Application.Features.Tasks.Queries.ListMyTasks;
using Workora.Application.Features.Tasks.Queries.ListTeamTasks;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing operational tasks and employee assignments.
/// </summary>
[ApiController]
[Route("api/v1/tasks")]
public class TasksController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="TasksController"/> class.
    /// </summary>
    public TasksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets company tasks with optional status and priority filters.
    /// </summary>
    [HttpGet]
    [Authorize(Policy = "tasks.view")]
    public async Task<ApiResponse<List<TaskItemDto>>> GetTasks([FromQuery] int? companyId, [FromQuery] TaskItemStatus? status, [FromQuery] TaskPriority? priority)
        => await _mediator.Send(new ListTeamTasksQuery(companyId, status, priority));

    /// <summary>
    /// Gets tasks assigned to the currently authenticated employee.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ApiResponse<List<TaskItemDto>>> GetMyTasks([FromQuery] TaskItemStatus? status)
        => await _mediator.Send(new ListMyTasksQuery(status));

    /// <summary>
    /// Gets specific task by ID.
    /// </summary>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "tasks.view")]
    public async Task<ApiResponse<TaskItemDto>> GetTaskById(int id)
        => await _mediator.Send(new GetTaskByIdQuery(id));

    /// <summary>
    /// Creates and assigns a new task.
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "tasks.manage")]
    public async Task<ApiResponse<TaskItemDto>> CreateTask([FromBody] CreateTaskCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates the status of a task.
    /// </summary>
    [HttpPatch("{id:int}/status")]
    [Authorize]
    public async Task<ApiResponse<TaskItemDto>> UpdateTaskStatus(int id, [FromBody] TaskItemStatus newStatus)
        => await _mediator.Send(new UpdateTaskStatusCommand(id, newStatus));

    /// <summary>
    /// Reassigns a task to another employee.
    /// </summary>
    [HttpPatch("{id:int}/assign")]
    [Authorize(Policy = "tasks.manage")]
    public async Task<ApiResponse<TaskItemDto>> AssignTask(int id, [FromBody] int newAssigneeEmployeeId)
        => await _mediator.Send(new AssignTaskCommand(id, newAssigneeEmployeeId));

    /// <summary>
    /// Deletes a task.
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize(Policy = "tasks.manage")]
    public async Task<ApiResponse<bool>> DeleteTask(int id)
        => await _mediator.Send(new DeleteTaskCommand(id));
}
