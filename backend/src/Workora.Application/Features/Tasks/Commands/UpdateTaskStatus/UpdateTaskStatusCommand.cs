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
