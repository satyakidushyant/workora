namespace Workora.Domain.Enums;

/// <summary>
/// Represents biological gender or identity for HR records.
/// </summary>
public enum Gender
{
    /// <summary>
    /// Male.
    /// </summary>
    Male = 1,

    /// <summary>
    /// Female.
    /// </summary>
    Female = 2,

    /// <summary>
    /// Other non-binary identity.
    /// </summary>
    Other = 3,

    /// <summary>
    /// Undisclosed / prefer not to say.
    /// </summary>
    PreferNotToSay = 4
}
