namespace Workora.Shared.Guards;

/// <summary>
/// Provides common guard clauses to enforce invariants.
/// </summary>
public static class Guard
{
    public static class Against
    {
        public static void NullOrEmpty(string? value, string parameterName = "value")
        {
            if (string.IsNullOrEmpty(value))
                throw new ArgumentException("Value cannot be null or empty.", parameterName);
        }
    }
}
