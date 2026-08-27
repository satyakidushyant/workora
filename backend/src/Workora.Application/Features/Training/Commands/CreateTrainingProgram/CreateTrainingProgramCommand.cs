using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Commands.CreateTrainingProgram;

/// <summary>
/// Command to create a new employee training program.
/// </summary>
public record CreateTrainingProgramCommand(
    int CompanyId,
    string Title,
    string Description,
    string TrainerName,
    DateOnly StartDate,
    DateOnly EndDate,
    int Capacity) : IRequest<ApiResponse<TrainingProgramDto>>;
