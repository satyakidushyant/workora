using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Tasks.DTOs;
namespace Workora.Application.Features.Tasks.Commands.DeleteTask;

/// <summary>
/// Command to delete a task.
/// </summary>
public record DeleteTaskCommand(int TaskId) : IRequest<ApiResponse<bool>>;
