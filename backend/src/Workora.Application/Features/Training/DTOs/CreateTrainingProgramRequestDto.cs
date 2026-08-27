using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.DTOs;

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
