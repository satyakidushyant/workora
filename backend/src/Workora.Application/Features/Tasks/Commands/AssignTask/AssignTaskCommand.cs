using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Commands.AssignTask;

/// <summary>
/// Command to reassign a task to another employee.
/// </summary>
public record AssignTaskCommand(int TaskId, int NewAssigneeEmployeeId) : IRequest<ApiResponse<TaskItemDto>>;

/// <summary>
/// Handler for <see cref="AssignTaskCommand"/>.
/// </summary>
public class AssignTaskCommandHandler : IRequestHandler<AssignTaskCommand, ApiResponse<TaskItemDto>>
{
    private readonly ITaskItemRepository _taskRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public AssignTaskCommandHandler(
        ITaskItemRepository taskRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _taskRepository = taskRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TaskItemDto>> Handle(AssignTaskCommand request, CancellationToken ct)
    {
        var task = await _taskRepository.GetByIdAsync(request.TaskId, ct);
        if (task == null)
        {
            return ApiResponse<TaskItemDto>.Fail("Task not found.");
        }

        var assignee = await _employeeRepository.GetByIdAsync(request.NewAssigneeEmployeeId, ct);
        if (assignee == null)
        {
            return ApiResponse<TaskItemDto>.Fail("New assignee employee not found.");
        }

        task.Reassign(request.NewAssigneeEmployeeId);
        _taskRepository.Update(task);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<TaskItemDto>(task);
        return ApiResponse<TaskItemDto>.Success(dto, "Task reassigned successfully.");
    }
}
