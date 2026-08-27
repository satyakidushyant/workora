using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.UpdateGoalProgress;

/// <summary>
/// Command to update the progress percentage and status of a goal.
/// </summary>
public record UpdateGoalProgressCommand(
    int Id,
    int ProgressPercentage,
    GoalStatus Status) : IRequest<ApiResponse<GoalDto>>;
