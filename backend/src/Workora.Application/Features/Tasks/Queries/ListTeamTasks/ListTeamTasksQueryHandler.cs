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
public class ListTeamTasksQueryHandler : IRequestHandler<ListTeamTasksQuery, ApiResponse<PagedResponse<TaskItemDto>>>
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
    public async Task<ApiResponse<PagedResponse<TaskItemDto>>> Handle(ListTeamTasksQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);
        var tasks = await _taskRepository.GetCompanyTasksAsync(targetCompanyId, request.Status, request.Priority, ct);
        var filtered = tasks
            .Where(t => string.IsNullOrWhiteSpace(request.SearchTerm) ||
                        t.Title.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                        (t.Description != null && t.Description.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase)))
            .ToList();

        var totalCount = filtered.Count;
        var pagedTasks = filtered
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var dtos = _mapper.Map<IReadOnlyList<TaskItemDto>>(pagedTasks);
        var pagedResponse = new PagedResponse<TaskItemDto>(dtos, totalCount, request.PageNumber, request.PageSize);
        return ApiResponse<PagedResponse<TaskItemDto>>.Success(pagedResponse);
    }
}

