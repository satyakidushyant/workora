using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.DTOs;

/// <summary>
/// Request payload for enrolling an employee.
/// </summary>
public record EnrollTrainingRequestDto(
    int TrainingProgramId,
    int EmployeeId);
