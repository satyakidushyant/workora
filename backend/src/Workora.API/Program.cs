using Workora.Application;
using Workora.Infrastructure;
using Workora.Persistence;
using Workora.Persistence.Seeders;
using Workora.API.Middleware;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using NLog;
using NLog.Web;
using Workora.API.Converters;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using System.Reflection;

var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("init main");

try
{
    var builder = WebApplication.CreateBuilder(args);

// Bind JwtSettings to configuration so infrastructure services can consume them via IOptions<JwtSettings>
builder.Services.Configure<Workora.Infrastructure.Authentication.JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

    // NLog: Setup NLog for Dependency injection
    builder.Logging.ClearProviders();
    builder.Host.UseNLog();

    // Add services to the container.
    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new StringSanitizerJsonConverter());
        });
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<Workora.Application.Common.Interfaces.ICurrentUserService, Workora.API.Services.CurrentUserService>();
builder.Services.AddSwaggerGen(c =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

// Clean Architecture Layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddPersistence(builder.Configuration);

// Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("auth.logout", policy => policy.RequireAuthenticatedUser());
    options.AddPolicy("auth.change-password", policy => policy.RequireAuthenticatedUser());
    options.AddPolicy("auth.me", policy => policy.RequireAuthenticatedUser());
    options.AddPolicy("auth.sessions", policy => policy.RequireAuthenticatedUser());
    options.AddPolicy("auth.logout-all", policy => policy.RequireAuthenticatedUser());
});

builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection")!);

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? context.Request.Headers.Host.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            }));
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        if (context.Database.IsRelational())
        {
            await context.Database.MigrateAsync();
        }

        var seeder = services.GetRequiredService<DatabaseSeeder>();
        await seeder.SeedAsync();
    }
    catch (Exception ex)
    {
        var appLogger = services.GetRequiredService<ILogger<Program>>();
        appLogger.LogError(ex, "An error occurred during database migration or seeding.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

    app.UseMiddleware<GlobalExceptionMiddleware>();
    app.UseMiddleware<RequestResponseLoggingMiddleware>();
    app.UseMiddleware<SecurityHeadersMiddleware>();

    app.UseHttpsRedirection();
    
    app.UseRateLimiter();

    app.UseAuthentication();
    app.UseMiddleware<UserContextMiddleware>();
    app.UseAuthorization();

    app.MapControllers();
    app.MapHealthChecks("/health");

    app.Run();
}
catch (Exception exception)
{
    // NLog: catch setup errors
    logger.Error(exception, "Stopped program because of exception");
    throw;
}
finally
{
    // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
    NLog.LogManager.Shutdown();
}
