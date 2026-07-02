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

    public StringSanitizerJsonConverter()
    {
        _sanitizer = new HtmlSanitizer();
    }

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

    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        // Outgoing data is not sanitized here; we assume the database is clean.
        // It could be sanitized, but it's typically better to sanitize on input.
        writer.WriteStringValue(value);
    }
}
