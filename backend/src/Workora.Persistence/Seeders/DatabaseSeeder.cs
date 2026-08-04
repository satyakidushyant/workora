using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Entities;
using Workora.Domain.ValueObjects;

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
                // 1. Seed Permissions Catalog
                await SeedPermissionsAsync();

                // 2. Seed System Roles
                await SeedRolesAsync();

                // 3. Seed Super Admin User and link to SuperAdmin Role
                await SeedSuperAdminUserAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private async Task SeedPermissionsAsync()
    {
        var existingCodes = await _context.Permissions.Select(p => p.Code).ToListAsync();
        var newPermissions = PermissionCatalog.SystemPermissions
            .Where(p => !existingCodes.Contains(p.Code.ToLowerInvariant()))
            .Select(p => Permission.Create(p.Code, p.Name, p.Module, p.Description))
            .ToList();

        if (newPermissions.Any())
        {
            _logger.LogInformation("Seeding {Count} system permissions...", newPermissions.Count);
            await _context.Permissions.AddRangeAsync(newPermissions);
            await _context.SaveChangesAsync();
        }
    }

    private async Task SeedRolesAsync()
    {
        var allPermissions = await _context.Permissions.ToListAsync();

        // Seed SuperAdmin Role
        var superAdminRole = await _context.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Name == "SuperAdmin");

        if (superAdminRole == null)
        {
            _logger.LogInformation("Seeding SuperAdmin role...");
            superAdminRole = Role.Create("SuperAdmin", "Full system administrator role with unrestricted access", isSystemRole: true);
            await _context.Roles.AddAsync(superAdminRole);
            await _context.SaveChangesAsync();
        }

        // Grant all permissions to SuperAdmin
        var existingSuperAdminPermissionIds = await _context.RolePermissions
            .Where(rp => rp.RoleId == superAdminRole.Id)
            .Select(rp => rp.PermissionId)
            .ToListAsync();

        var missingForSuperAdmin = allPermissions
            .Where(p => !existingSuperAdminPermissionIds.Contains(p.Id))
            .Select(p => RolePermission.Create(superAdminRole.Id, p.Id))
            .ToList();

        if (missingForSuperAdmin.Any())
        {
            await _context.RolePermissions.AddRangeAsync(missingForSuperAdmin);
            await _context.SaveChangesAsync();
        }

        // Seed Employee Role
        var employeeRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Employee");
        if (employeeRole == null)
        {
            _logger.LogInformation("Seeding Employee role...");
            employeeRole = Role.Create("Employee", "Standard employee role for self-service functionality", isSystemRole: true);
            await _context.Roles.AddAsync(employeeRole);
            await _context.SaveChangesAsync();
        }
    }

    private async Task SeedSuperAdminUserAsync()
    {
        var adminEmail = EmailAddress.Create("admin@workora.com");
        var admin = await _context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);

        if (admin == null)
        {
            _logger.LogInformation("Seeding Super Admin user...");
            var passwordHash = _passwordHasher.HashPassword("SuperSecureP@ssw0rd!");
            admin = User.Create(adminEmail, "Super", "Admin", passwordHash);
            
            await _context.Users.AddAsync(admin);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Super Admin user seeded successfully.");
        }

        var superAdminRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "SuperAdmin");
        if (superAdminRole != null)
        {
            var userRoleExists = await _context.UserRoles.AnyAsync(ur => ur.UserId == admin.Id && ur.RoleId == superAdminRole.Id);
            if (!userRoleExists)
            {
                await _context.UserRoles.AddAsync(UserRole.Create(admin.Id, superAdminRole.Id));
                await _context.SaveChangesAsync();
            }
        }
    }
}
