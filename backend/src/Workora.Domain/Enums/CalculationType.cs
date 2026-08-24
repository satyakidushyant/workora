namespace Workora.Domain.Enums;

/// <summary>
/// Specifies the calculation method for a salary component value.
/// </summary>
public enum CalculationType
{
    /// <summary>
    /// Fixed monetary amount.
    /// </summary>
    Fixed = 1,

    /// <summary>
    /// Percentage calculated against the base / basic salary.
    /// </summary>
    PercentageOfBasic = 2,

    /// <summary>
    /// Percentage calculated against the gross salary.
    /// </summary>
    PercentageOfGross = 3
}
