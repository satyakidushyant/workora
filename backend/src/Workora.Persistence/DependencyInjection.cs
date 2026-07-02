using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Workora.Domain.Interfaces;
using Workora.Persistence.Repositories;
using Workora.Persistence.Seeders;

namespace Workora.Persistence;

/// <summary>
/// Provides extension methods for setting up dependency injection for the Persistence layer.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Registers Persistence layer services, such as the DbContext and Repositories.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <param name="configuration">The application configuration.</param>
    /// <returns>The updated service collection.</returns>
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                   .UseSnakeCaseNamingConvention());

        services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<AppDbContext>());

        services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
        services.AddScoped<ILoginAuditLogRepository, LoginAuditLogRepository>();

        services.AddScoped<DatabaseSeeder>();

        return services;
    }
}
