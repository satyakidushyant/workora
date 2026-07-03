using System.Text.Json;
using System.Text.Json.Serialization;
using Ganss.Xss;

namespace Workora.API.Converters;

/// <summary>
/// A custom JSON converter that automatically trims strings and sanitizes them from HTML/XSS content.
/// </summary>
public class StringSanitizerJsonConverter : JsonConverter<string>
{
    private readonly HtmlSanitizer _sanitizer;

    /// <summary>
    /// Initializes a new instance of the <see cref="StringSanitizerJsonConverter"/> class.
    /// </summary>
    public StringSanitizerJsonConverter()
    {
        _sanitizer = new HtmlSanitizer();
    }

    /// <summary>
    /// Reads and converts the JSON to type string, sanitizing the input.
    /// </summary>
    /// <param name="reader">The JSON reader.</param>
    /// <param name="typeToConvert">The type to convert.</param>
    /// <param name="options">The serializer options.</param>
    /// <returns>The sanitized string.</returns>
    public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();

        if (string.IsNullOrEmpty(value))
        {
            return value;
        }

        // 1. Trim whitespace
        var trimmed = value.Trim();

        // 2. Sanitize HTML tags
        var sanitized = _sanitizer.Sanitize(trimmed);

        // Sanitize might return empty if the string was pure malicious tags
        return sanitized;
    }

    /// <summary>
    /// Writes a specified value as JSON.
    /// </summary>
    /// <param name="writer">The JSON writer.</param>
    /// <param name="value">The value to write.</param>
    /// <param name="options">The serializer options.</param>
    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        // Outgoing data is not sanitized here; we assume the database is clean.
        // It could be sanitized, but it's typically better to sanitize on input.
        writer.WriteStringValue(value);
    }
}
