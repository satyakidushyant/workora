using System.ComponentModel;
using System.Reflection;

namespace Workora.Domain.Extensions;

/// <summary>
/// Provides extension methods for Enums.
/// </summary>
public static class EnumExtensions
{
    /// <summary>
    /// Retrieves the description from the DescriptionAttribute of an enum value.
    /// If the attribute is not found, it returns the enum value's name as a string.
    /// </summary>
    /// <param name="value">The enum value.</param>
    /// <returns>The description string.</returns>
    public static string GetDescription(this Enum value)
    {
        var fieldInfo = value.GetType().GetField(value.ToString());
        
        if (fieldInfo == null)
            return value.ToString();

        var attributes = (DescriptionAttribute[])fieldInfo.GetCustomAttributes(
            typeof(DescriptionAttribute), false);

        if (attributes != null && attributes.Length > 0)
        {
            return attributes[0].Description;
        }
        else
        {
            return value.ToString();
        }
    }
}
