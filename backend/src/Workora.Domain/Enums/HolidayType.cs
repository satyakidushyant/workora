namespace Workora.Domain.Enums;

/// <summary>
/// Represents the classification of a holiday.
/// </summary>
public enum HolidayType
{
    /// <summary>
    /// Mandatory public or national holiday.
    /// </summary>
    Public = 1,

    /// <summary>
    /// Optional or restricted holiday.
    /// </summary>
    Optional = 2,

    /// <summary>
    /// Company or branch-specific observance.
    /// </summary>
    CompanySpecific = 3
}
