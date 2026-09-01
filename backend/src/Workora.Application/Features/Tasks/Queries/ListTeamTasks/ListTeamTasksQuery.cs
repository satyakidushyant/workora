using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Queries.ListTeamTasks;

/// <summary>
/// Query to list company tasks with dynamic pagination and filtering.
/// </summary>
public record ListTeamTasksQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<TaskItemDto>>>
{
    /// <summary>
    /// Gets or init optional filter for company ID.
    /// </summary>
    public int? CompanyId { get; init; }

    /// <summary>
    /// Gets or init optional filter for task status.
    /// </summary>
    public TaskItemStatus? Status { get; init; }

    /// <summary>
    /// Gets or init optional filter for task priority.
    /// </summary>
    public TaskPriority? Priority { get; init; }
}

