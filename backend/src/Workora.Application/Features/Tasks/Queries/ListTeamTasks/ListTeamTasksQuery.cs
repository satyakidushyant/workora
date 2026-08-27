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
