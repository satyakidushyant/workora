using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.DTOs;

/// <summary>
/// Data transfer object representing a live employee GPS telemetry point.
/// </summary>
public record LiveLocationDto(
    int EmployeeId,
    string? EmployeeName,
    string? EmployeeCode,
    decimal Latitude,
    decimal Longitude,
    DateTimeOffset RecordedAt,
    decimal AccuracyMeters,
    int BatteryPercentage);
