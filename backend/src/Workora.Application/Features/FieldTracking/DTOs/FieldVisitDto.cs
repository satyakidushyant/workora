using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.DTOs;

/// <summary>
/// Data transfer object representing a client field visit.
/// </summary>
public record FieldVisitDto(
    int Id,
    Guid Uuid,
    int EmployeeId,
    string? EmployeeName,
    string? EmployeeCode,
    string ClientName,
    string VisitPurpose,
    DateTimeOffset CheckInTime,
    decimal CheckInLatitude,
    decimal CheckInLongitude,
    string CheckInAddress,
    DateTimeOffset? CheckOutTime,
    decimal? CheckOutLatitude,
    decimal? CheckOutLongitude,
    decimal DistanceTraveledKm,
    string? MeetingNotes,
    string? SignatureUrl,
    DateTimeOffset CreatedAt);
