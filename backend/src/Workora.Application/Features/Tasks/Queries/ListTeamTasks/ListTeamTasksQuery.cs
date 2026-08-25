using AutoMapper;
using MediatR;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Queries.ListTeamTasks;

/// <summary>
/// Query to list company tasks with optional status and priority filters.
/// </summary>
public record ListTeamTasksQuery(int? CompanyId, TaskItemStatus? Status, TaskPriority? Priority) : IRequest<ApiResponse<List<TaskItemDto>>>;

/// <summary>
/// Handler for <see cref="ListTeamTasksQuery"/>.
/// </summary>
public class ListTeamTasksQueryHandler : IRequestHandler<ListTeamTasksQuery, ApiResponse<List<TaskItemDto>>>
{
    private readonly ITaskItemRepository _taskRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ListTeamTasksQueryHandler(ITaskItemRepository taskRepository, IMapper mapper)
    {
        _taskRepository = taskRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<List<TaskItemDto>>> Handle(ListTeamTasksQuery request, CancellationToken ct)
    {
        var tasks = await _taskRepository.GetCompanyTasksAsync(request.CompanyId, request.Status, request.Priority, ct);
        var dtos = _mapper.Map<List<TaskItemDto>>(tasks);
        return ApiResponse<List<TaskItemDto>>.Success(dtos);
    }
}
