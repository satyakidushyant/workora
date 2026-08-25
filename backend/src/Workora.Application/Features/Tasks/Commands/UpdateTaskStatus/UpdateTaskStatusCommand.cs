using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Commands.UpdateTaskStatus;

/// <summary>
/// Command to update the status of a task.
/// </summary>
public record UpdateTaskStatusCommand(int TaskId, TaskItemStatus NewStatus) : IRequest<ApiResponse<TaskItemDto>>;

/// <summary>
/// Handler for <see cref="UpdateTaskStatusCommand"/>.
/// </summary>
public class UpdateTaskStatusCommandHandler : IRequestHandler<UpdateTaskStatusCommand, ApiResponse<TaskItemDto>>
{
    private readonly ITaskItemRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public UpdateTaskStatusCommandHandler(
        ITaskItemRepository taskRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TaskItemDto>> Handle(UpdateTaskStatusCommand request, CancellationToken ct)
    {
        var task = await _taskRepository.GetByIdAsync(request.TaskId, ct);
        if (task == null)
        {
            return ApiResponse<TaskItemDto>.Fail("Task not found.");
        }

        task.UpdateStatus(request.NewStatus);
        _taskRepository.Update(task);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<TaskItemDto>(task);
        return ApiResponse<TaskItemDto>.Success(dto, "Task status updated.");
    }
}
