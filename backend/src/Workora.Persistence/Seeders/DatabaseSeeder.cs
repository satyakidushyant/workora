using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Entities;

namespace Workora.Persistence.Seeders;

/// <summary>
/// Seeds initial data into the database.
/// </summary>
public class DatabaseSeeder
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<DatabaseSeeder> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="DatabaseSeeder"/> class.
    /// </summary>
    public DatabaseSeeder(AppDbContext context, IPasswordHasher passwordHasher, ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    /// <summary>
    /// Seeds the database with default records if they do not exist.
    /// </summary>
    public async Task SeedAsync()
    {
        try
        {
            if (await _context.Database.CanConnectAsync())
            {
                if (!await _context.Users.AnyAsync(u => u.Email == "admin@workora.com"))
                {
                    _logger.LogInformation("Seeding Super Admin user...");
                    var passwordHash = _passwordHasher.HashPassword("SuperSecureP@ssw0rd!");
                    var admin = User.Create("admin@workora.com", "Super", "Admin", passwordHash);
                    
                    await _context.Users.AddAsync(admin);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Super Admin user seeded successfully.");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }
}
