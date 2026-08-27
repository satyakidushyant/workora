using Workora.Domain.Enums;
using Workora.Shared.Responses;

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
