using Workora.Domain.Enums;

namespace Workora.Application.Features.Training.DTOs;

/// <summary>
/// DTO representing a training program course.
/// </summary>
public record TrainingProgramDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    string Title,
    string Description,
    string TrainerName,
    DateOnly StartDate,
    DateOnly EndDate,
    int Capacity,
    int EnrolledCount,
    bool IsActive,
    DateTimeOffset CreatedAt);

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

/// <summary>
/// Request payload for creating a training program.
/// </summary>
public record CreateTrainingProgramRequestDto(
    int CompanyId,
    string Title,
    string Description,
    string TrainerName,
    DateOnly StartDate,
    DateOnly EndDate,
    int Capacity);

/// <summary>
/// Request payload for enrolling an employee.
/// </summary>
public record EnrollTrainingRequestDto(
    int TrainingProgramId,
    int EmployeeId);
