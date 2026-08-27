using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Commands.EnrollInTraining;

/// <summary>
/// Command to enroll an employee in a training program.
/// </summary>
public record EnrollInTrainingCommand(
    int TrainingProgramId,
    int EmployeeId) : IRequest<ApiResponse<TrainingEnrollmentDto>>;
