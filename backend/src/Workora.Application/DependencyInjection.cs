using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Workora.Application;

/// <summary>
/// Provides extension methods for setting up dependency injection for the Application layer.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Registers Application layer services, MediatR, AutoMapper, and FluentValidation.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <returns>The updated service collection.</returns>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(config => { }, Assembly.GetExecutingAssembly());
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddMediatR(cfg => {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            // Add Behaviors here if needed
        });

        return services;
    }
}
