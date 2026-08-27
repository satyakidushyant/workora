using AutoMapper;
using MediatR;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Queries.GetTaskById;

/// <summary>
/// Query to get task details by ID.
/// </summary>
public record GetTaskByIdQuery(int TaskId) : IRequest<ApiResponse<TaskItemDto>>;
