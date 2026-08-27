using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Queries.GetTaskById;

/// <summary>
/// Handler for <see cref="GetTaskByIdQuery"/>.
/// </summary>
public class GetTaskByIdQueryHandler : IRequestHandler<GetTaskByIdQuery, ApiResponse<TaskItemDto>>
{
    private readonly ITaskItemRepository _taskRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public GetTaskByIdQueryHandler(ITaskItemRepository taskRepository, IMapper mapper)
    {
        _taskRepository = taskRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TaskItemDto>> Handle(GetTaskByIdQuery request, CancellationToken ct)
    {
        var task = await _taskRepository.GetByIdAsync(request.TaskId, ct);
        if (task == null)
        {
            return ApiResponse<TaskItemDto>.Fail(ResponseMessage.TaskNotFound.GetDescription());
        }

        var dto = _mapper.Map<TaskItemDto>(task);
        return ApiResponse<TaskItemDto>.Success(dto);
    }
}
