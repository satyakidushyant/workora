using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Commands.AssignTask;

/// <summary>
/// Command to reassign a task to another employee.
/// </summary>
public record AssignTaskCommand(int TaskId, int NewAssigneeEmployeeId) : IRequest<ApiResponse<TaskItemDto>>;
