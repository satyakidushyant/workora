using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Queries.ListTeamTasks;

/// <summary>
/// Handler for <see cref="ListTeamTasksQuery"/>.
/// </summary>
public class ListTeamTasksQueryHandler : IRequestHandler<ListTeamTasksQuery, ApiResponse<List<TaskItemDto>>>
{
    private readonly ITaskItemRepository _taskRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ListTeamTasksQueryHandler(
        ITaskItemRepository taskRepository,
        ITenantResolutionService tenantResolutionService,
        IMapper mapper)
    {
        _taskRepository = taskRepository;
        _tenantResolutionService = tenantResolutionService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<List<TaskItemDto>>> Handle(ListTeamTasksQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);
        var tasks = await _taskRepository.GetCompanyTasksAsync(targetCompanyId, request.Status, request.Priority, ct);
        var dtos = _mapper.Map<List<TaskItemDto>>(tasks);
        return ApiResponse<List<TaskItemDto>>.Success(dtos);
    }
}
