using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a periodic telemetry GPS ping recorded by an active mobile field agent.
/// </summary>
public class FieldGpsPing : BaseEntity
{
    /// <summary>
    /// The employee who reported the GPS location.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Gets the navigation property for the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// Latitude coordinates.
    /// </summary>
    public decimal Latitude { get; private set; }

    /// <summary>
    /// Longitude coordinates.
    /// </summary>
    public decimal Longitude { get; private set; }

    /// <summary>
    /// Timestamp when ping was recorded on device.
    /// </summary>
    public DateTimeOffset RecordedAt { get; private set; }

    /// <summary>
    /// Accuracy radius in meters reported by device.
    /// </summary>
    public decimal AccuracyMeters { get; private set; }

    /// <summary>
    /// Battery level percentage on device.
    /// </summary>
    public int BatteryPercentage { get; private set; }

    private FieldGpsPing() { } // EF Core

    /// <summary>
    /// Factory method to create a new telemetry ping.
    /// </summary>
    public static FieldGpsPing Create(
        int employeeId,
        decimal latitude,
        decimal longitude,
        DateTimeOffset recordedAt,
        decimal accuracyMeters,
        int batteryPercentage)
    {
        return new FieldGpsPing
        {
            EmployeeId = employeeId,
            Latitude = latitude,
            Longitude = longitude,
            RecordedAt = recordedAt,
            AccuracyMeters = accuracyMeters,
            BatteryPercentage = batteryPercentage
        };
    }
}
