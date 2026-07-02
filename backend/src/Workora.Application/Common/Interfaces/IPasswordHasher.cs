namespace Workora.Application.Common.Interfaces;

/// <summary>
/// Service for hashing and verifying passwords securely.
/// </summary>
public interface IPasswordHasher
{
    /// <summary>
    /// Hashes a plain-text password.
    /// </summary>
    /// <param name="password">The plain-text password.</param>
    /// <returns>The hashed password.</returns>
    string HashPassword(string password);

    /// <summary>
    /// Verifies that a plain-text password matches the provided hash.
    /// </summary>
    /// <param name="password">The plain-text password.</param>
    /// <param name="hashedPassword">The previously hashed password.</param>
    /// <returns>True if they match, false otherwise.</returns>
    bool VerifyPassword(string password, string hashedPassword);
}
