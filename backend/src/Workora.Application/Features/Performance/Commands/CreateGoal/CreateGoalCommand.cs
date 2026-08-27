using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.CreateGoal;

/// <summary>
/// Command to create a performance goal / KPI for an employee.
/// </summary>
public record CreateGoalCommand(
    int EmployeeId,
    string Title,
    string Description,
    DateOnly TargetDate) : IRequest<ApiResponse<GoalDto>>;
