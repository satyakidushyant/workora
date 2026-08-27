using AutoMapper;
using MediatR;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Commands.CompleteTrainingEnrollment;

/// <summary>
/// Command to mark an employee's training program enrollment as complete.
/// </summary>
public record CompleteTrainingEnrollmentCommand(int Id) : IRequest<ApiResponse<TrainingEnrollmentDto>>;
