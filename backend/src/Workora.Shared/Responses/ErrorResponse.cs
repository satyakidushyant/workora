namespace Workora.Shared.Responses;

/// <summary>
/// Represents a validation or field-specific error.
/// </summary>
public record FieldError(string Field, string Message);
