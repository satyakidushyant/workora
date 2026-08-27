using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Queries.ListMyTasks;

/// <summary>
/// Query to list tasks assigned to the currently authenticated employee.
/// </summary>
public record ListMyTasksQuery(TaskItemStatus? Status) : IRequest<ApiResponse<List<TaskItemDto>>>;
