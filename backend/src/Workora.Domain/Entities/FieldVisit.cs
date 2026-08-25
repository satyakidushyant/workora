using Workora.Domain.Common;
using Workora.Domain.Exceptions;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a field visit or client meeting conducted by an employee.
/// </summary>
public class FieldVisit : AuditableEntity
{
    /// <summary>
    /// The employee conducting the field visit.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Gets the navigation property for the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// Name of client company or person visited.
    /// </summary>
    public string ClientName { get; private set; } = string.Empty;

    /// <summary>
    /// Purpose of the meeting / visit.
    /// </summary>
    public string VisitPurpose { get; private set; } = string.Empty;

    /// <summary>
    /// Timestamp of check-in at client site.
    /// </summary>
    public DateTimeOffset CheckInTime { get; private set; }

    /// <summary>
    /// Latitude coordinates at check-in.
    /// </summary>
    public decimal CheckInLatitude { get; private set; }

    /// <summary>
    /// Longitude coordinates at check-in.
    /// </summary>
    public decimal CheckInLongitude { get; private set; }

    /// <summary>
    /// Reverse geocoded physical address at check-in.
    /// </summary>
    public string CheckInAddress { get; private set; } = string.Empty;

    /// <summary>
    /// Timestamp of check-out from client site.
    /// </summary>
    public DateTimeOffset? CheckOutTime { get; private set; }

    /// <summary>
    /// Latitude coordinates at check-out.
    /// </summary>
    public decimal? CheckOutLatitude { get; private set; }

    /// <summary>
    /// Longitude coordinates at check-out.
    /// </summary>
    public decimal? CheckOutLongitude { get; private set; }

    /// <summary>
    /// Total distance traveled during visit in kilometers.
    /// </summary>
    public decimal DistanceTraveledKm { get; private set; }

    /// <summary>
    /// Discussion notes and action items from visit.
    /// </summary>
    public string? MeetingNotes { get; private set; }

    /// <summary>
    /// Storage URL for client digital signature or photo proof.
    /// </summary>
    public string? SignatureUrl { get; private set; }

    private FieldVisit() { } // EF Core

    /// <summary>
    /// Factory method to record visit check-in.
    /// </summary>
    public static FieldVisit CheckIn(
        int employeeId,
        string clientName,
        string visitPurpose,
        decimal latitude,
        decimal longitude,
        string address)
    {
        if (string.IsNullOrWhiteSpace(clientName))
            throw new DomainException("Client name is required.");

        return new FieldVisit
        {
            EmployeeId = employeeId,
            ClientName = clientName,
            VisitPurpose = visitPurpose,
            CheckInTime = DateTimeOffset.UtcNow,
            CheckInLatitude = latitude,
            CheckInLongitude = longitude,
            CheckInAddress = address,
            DistanceTraveledKm = 0
        };
    }

    /// <summary>
    /// Records visit check-out with final notes and distance.
    /// </summary>
    public void CheckOut(decimal latitude, decimal longitude, decimal distanceKm, string? meetingNotes, string? signatureUrl)
    {
        CheckOutTime = DateTimeOffset.UtcNow;
        CheckOutLatitude = latitude;
        CheckOutLongitude = longitude;
        DistanceTraveledKm = distanceKm;
        MeetingNotes = meetingNotes;
        SignatureUrl = signatureUrl;
    }
}
