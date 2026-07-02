using Microsoft.Extensions.DependencyInjection;
using Workora.Application.Common.Interfaces;
using Workora.Infrastructure.Authentication;
using Workora.Infrastructure.Email;

namespace Workora.Infrastructure;

/// <summary>
/// Provides extension methods for setting up dependency injection for the Infrastructure layer.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Registers Infrastructure layer services such as JWT authentication, password hashing, and email.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <returns>The updated service collection.</returns>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<ITokenService, TokenService>();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IEmailService, SmtpEmailService>();

        return services;
    }
}
