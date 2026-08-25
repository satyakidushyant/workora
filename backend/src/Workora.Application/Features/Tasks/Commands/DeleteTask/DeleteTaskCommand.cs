using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Commands.DeleteTask;

/// <summary>
/// Command to delete a task.
/// </summary>
public record DeleteTaskCommand(int TaskId) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Handler for <see cref="DeleteTaskCommand"/>.
/// </summary>
public class DeleteTaskCommandHandler : IRequestHandler<DeleteTaskCommand, ApiResponse<bool>>
{
    private readonly ITaskItemRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public DeleteTaskCommandHandler(ITaskItemRepository taskRepository, IUnitOfWork unitOfWork)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(DeleteTaskCommand request, CancellationToken ct)
    {
        var task = await _taskRepository.GetByIdAsync(request.TaskId, ct);
        if (task == null)
        {
            return ApiResponse<bool>.Fail("Task not found.");
        }

        _taskRepository.Remove(task);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, "Task deleted successfully.");
    }
}
