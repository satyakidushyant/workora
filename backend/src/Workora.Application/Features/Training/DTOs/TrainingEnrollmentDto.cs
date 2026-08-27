using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.DTOs;

/// <summary>
/// DTO representing a training enrollment.
/// </summary>
public record TrainingEnrollmentDto(
    int Id,
    int TrainingProgramId,
    string? ProgramTitle,
    int EmployeeId,
    string? EmployeeName,
    TrainingStatus Status,
    DateTimeOffset? CompletedAt,
    DateTimeOffset CreatedAt);
