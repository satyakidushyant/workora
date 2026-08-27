using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Commands.CreateTask;

/// <summary>
/// Command to create a new task.
/// </summary>
public record CreateTaskCommand(
    int CompanyId,
    string Title,
    string? Description,
    int AssignedToEmployeeId,
    int CreatedByEmployeeId,
    TaskPriority Priority,
    DateOnly DueDate) : IRequest<ApiResponse<TaskItemDto>>;
