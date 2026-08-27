using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Workora.Application.Common.Interfaces;
using Workora.Infrastructure.Authentication;
using Workora.Infrastructure.Caching;
using Workora.Infrastructure.Email;
using Workora.Infrastructure.Services;
using Workora.Infrastructure.Storage;

namespace Workora.Infrastructure;

/// <summary>
/// Provides extension methods for setting up dependency injection for the Infrastructure layer.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Registers Infrastructure layer services such as JWT authentication, password hashing, Cloudinary storage, and email.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <param name="configuration">Application configuration configuration root.</param>
    /// <returns>The updated service collection.</returns>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<ITokenService, TokenService>();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IEmailService, SmtpEmailService>();
        services.AddScoped<ITenantResolutionService, TenantResolutionService>();

        services.Configure<CloudinarySettings>(configuration.GetSection(CloudinarySettings.SectionName));
        services.AddScoped<IFileStorageService, CloudinaryFileStorageService>();

        var useRedis = configuration.GetValue<bool>("CacheSettings:UseRedis");
        if (useRedis)
        {
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = configuration.GetValue<string>("CacheSettings:RedisConnectionString");
            });
            services.AddSingleton<ICacheService, RedisCacheService>();
        }
        else
        {
            services.AddMemoryCache();
            services.AddSingleton<ICacheService, MemoryCacheService>();
        }

        return services;
    }
}
