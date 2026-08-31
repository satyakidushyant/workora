using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.ValueObjects;

namespace Workora.Persistence.Seeders;

/// <summary>
/// Seeds initial foundational database records including system permissions, tiered system roles,
/// SaaS subscription plans, and root platform administrator accounts.
/// </summary>
public class DatabaseSeeder
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<DatabaseSeeder> _logger;

    /// <summary>
    /// Default password configured for initial platform root administrator accounts.
    /// </summary>
    private const string DefaultPassword = "Admin@123";

    /// <summary>
    /// Initializes a new instance of the <see cref="DatabaseSeeder"/> class.
    /// </summary>
    /// <param name="context">The database context instance.</param>
    /// <param name="passwordHasher">The cryptographic password hasher service.</param>
    /// <param name="logger">The structured logging service.</param>
    public DatabaseSeeder(AppDbContext context, IPasswordHasher passwordHasher, ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    /// <summary>
    /// Seeds the database with essential platform definitions and root administrator accounts.
    /// </summary>
    /// <returns>A asynchronous task representing the seeding operation.</returns>
    public async Task SeedAsync()
    {
        try
        {
            if (await _context.Database.CanConnectAsync())
            {
                _logger.LogInformation("Starting database seeding process (Root Admin & System Definitions)...");

                // 1. Seed Permissions Catalog
                await SeedPermissionsAsync();

                // 2. Seed System Roles with appropriate Permission Mappings
                await SeedRolesAsync();

                // 3. Seed Subscription Plans (SuperAdmin SaaS module)
                await SeedSubscriptionPlansAsync();

                // 4. Seed Root SuperAdmin User Accounts
                await SeedSuperAdminUsersAsync();

                _logger.LogInformation("Database seeding completed successfully. Only Root Admin and system roles/permissions are provisioned.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    /// <summary>
    /// Synchronizes the compiled permission catalog into the database.
    /// </summary>
    private async Task SeedPermissionsAsync()
    {
        var existingCodes = await _context.Permissions.Select(p => p.Code.ToLower()).ToListAsync();
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

    /// <summary>
    /// Seeds core tiered system roles (SuperAdmin, HRAdmin, FinanceManager, Manager, Employee) and maps permissions.
    /// </summary>
    private async Task SeedRolesAsync()
    {
        var allPermissions = await _context.Permissions.ToListAsync();
        var permissionMap = allPermissions.ToDictionary(p => p.Code, p => p.Id, StringComparer.OrdinalIgnoreCase);

        // 1. SuperAdmin Role (Unrestricted platform access)
        await UpsertRoleWithPermissionsAsync(
            roleName: "SuperAdmin",
            description: "Full platform owner with unrestricted access across all tenant organizations and system settings.",
            assignedPermissionCodes: permissionMap.Keys,
            permissionMap: permissionMap);

        // 2. HRAdmin Role
        var hrAdminPermissions = permissionMap.Keys.Where(code =>
            code.StartsWith("auth.") ||
            code.StartsWith("users.") ||
            code.StartsWith("company.") || code.StartsWith("companies.") ||
            code.StartsWith("branches.") ||
            code.StartsWith("departments.") ||
            code.StartsWith("designations.") ||
            code.StartsWith("employees.") ||
            code.StartsWith("shifts.") ||
            code.StartsWith("holidays.") ||
            code.StartsWith("attendance.") ||
            code.StartsWith("leave.") ||
            code.StartsWith("recruitment.") ||
            code.StartsWith("onboarding.") ||
            code.StartsWith("performance.") ||
            code.StartsWith("training.") ||
            code.StartsWith("assets.") ||
            code.StartsWith("helpdesk.") ||
            code.StartsWith("documents.") ||
            code.StartsWith("policies.") ||
            code.StartsWith("reports.") ||
            code.StartsWith("dashboard.") ||
            code.StartsWith("settings.view")).ToList();

        await UpsertRoleWithPermissionsAsync(
            roleName: "HRAdmin",
            description: "Tenant human resources administrator managing workforce lifecycle, time, leaves, and policies.",
            assignedPermissionCodes: hrAdminPermissions,
            permissionMap: permissionMap);

        // 3. FinanceManager Role
        var financePermissions = permissionMap.Keys.Where(code =>
            code.StartsWith("auth.") ||
            code.StartsWith("company.view") ||
            code.StartsWith("branches.view") ||
            code.StartsWith("departments.view") ||
            code.StartsWith("designations.view") ||
            code.StartsWith("employees.view") ||
            code.StartsWith("salary.") ||
            code.StartsWith("payroll.") ||
            code.StartsWith("compliance.") ||
            code.StartsWith("loans.") ||
            code.StartsWith("expenses.") ||
            code.StartsWith("reports.") ||
            code.StartsWith("dashboard.")).ToList();

        await UpsertRoleWithPermissionsAsync(
            roleName: "FinanceManager",
            description: "Tenant finance and payroll officer managing compensation, statutory compliance, loans, and batch runs.",
            assignedPermissionCodes: financePermissions,
            permissionMap: permissionMap);

        // 4. Manager Role
        var managerPermissions = permissionMap.Keys.Where(code =>
            code.StartsWith("auth.") ||
            code.StartsWith("company.view") ||
            code.StartsWith("employees.view") ||
            code.StartsWith("departments.view") ||
            code.StartsWith("designations.view") ||
            code.StartsWith("branches.view") ||
            code.StartsWith("shifts.view") ||
            code.StartsWith("holidays.view") ||
            code == "attendance.view" || code == "attendance.approve" || code == "attendance.self" ||
            code == "leave.view" || code == "leave.approve" || code == "leave.apply" || code == "leave.self" ||
            code == "expenses.view" || code == "expenses.approve" || code == "expenses.submit" ||
            code.StartsWith("tasks.") ||
            code.StartsWith("performance.") ||
            code == "helpdesk.view" || code == "helpdesk.create" ||
            code.StartsWith("documents.view") ||
            code.StartsWith("policies.view") ||
            code == "reports.view" ||
            code == "dashboard.view" ||
            code == "payroll.self" ||
            code == "loans.apply" || code == "loans.view" ||
            code == "employees.self").ToList();

        await UpsertRoleWithPermissionsAsync(
            roleName: "Manager",
            description: "People manager with team approval authority over attendance, leave, expenses, and performance reviews.",
            assignedPermissionCodes: managerPermissions,
            permissionMap: permissionMap);

        // 5. Employee Role (Level 3 ESS)
        var employeePermissions = permissionMap.Keys.Where(code =>
            code.StartsWith("auth.") ||
            code == "employees.self" ||
            code == "employees.view" ||
            code == "departments.view" ||
            code == "designations.view" ||
            code == "branches.view" ||
            code == "company.view" ||
            code == "shifts.view" ||
            code == "holidays.view" ||
            code == "training.view" ||
            code == "attendance.self" || code == "attendance.view" ||
            code == "leave.self" || code == "leave.apply" ||
            code == "payroll.self" ||
            code == "performance.self" ||
            code == "expenses.submit" || code == "expenses.view" ||
            code == "loans.apply" || code == "loans.view" ||
            code == "tasks.view" ||
            code == "helpdesk.create" || code == "helpdesk.view" ||
            code == "documents.view" ||
            code == "policies.view" ||
            code == "dashboard.view").ToList();

        await UpsertRoleWithPermissionsAsync(
            roleName: "Employee",
            description: "Standard employee self-service role for clock-in, leave application, payslip access, and requests.",
            assignedPermissionCodes: employeePermissions,
            permissionMap: permissionMap);
    }

    /// <summary>
    /// Upserts a system role and ensures all specified permission mappings exist.
    /// </summary>
    /// <param name="roleName">The name of the role.</param>
    /// <param name="description">The description of the role.</param>
    /// <param name="assignedPermissionCodes">The collection of permission codes mapped to this role.</param>
    /// <param name="permissionMap">The dictionary mapping permission code to permission database ID.</param>
    private async Task UpsertRoleWithPermissionsAsync(
        string roleName,
        string description,
        IEnumerable<string> assignedPermissionCodes,
        Dictionary<string, int> permissionMap)
    {
        var role = await _context.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Name == roleName);

        if (role == null)
        {
            _logger.LogInformation("Seeding role: {RoleName}...", roleName);
            role = Role.Create(roleName, description, isSystemRole: true);
            await _context.Roles.AddAsync(role);
            await _context.SaveChangesAsync();
        }

        var existingPermissionIds = await _context.RolePermissions
            .Where(rp => rp.RoleId == role.Id)
            .Select(rp => rp.PermissionId)
            .ToListAsync();

        var missingRolePermissions = assignedPermissionCodes
            .Where(code => permissionMap.ContainsKey(code))
            .Select(code => permissionMap[code])
            .Where(pId => !existingPermissionIds.Contains(pId))
            .Select(pId => RolePermission.Create(role.Id, pId))
            .ToList();

        if (missingRolePermissions.Any())
        {
            await _context.RolePermissions.AddRangeAsync(missingRolePermissions);
            await _context.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Seeds SuperAdmin subscription plans for multi-tenant subscription tiers.
    /// </summary>
    private async Task SeedSubscriptionPlansAsync()
    {
        if (!await _context.SubscriptionPlans.AnyAsync())
        {
            var plans = new List<SubscriptionPlan>
            {
                SubscriptionPlan.Create("Starter", "Ideal for emerging startups with up to 25 team members.", 49.00m, 25, SubscriptionBillingCycle.Monthly),
                SubscriptionPlan.Create("Growth", "Engineered for scaling enterprises with up to 250 employees.", 199.00m, 250, SubscriptionBillingCycle.Monthly),
                SubscriptionPlan.Create("Enterprise", "Unlimited workforce scalability, dedicated SLA, and full compliance features.", 499.00m, 10000, SubscriptionBillingCycle.Monthly)
            };

            await _context.SubscriptionPlans.AddRangeAsync(plans);
            await _context.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Seeds the single root SuperAdmin user account (admin@workora.com) with the SuperAdmin role.
    /// </summary>
    private async Task SeedSuperAdminUsersAsync()
    {
        var passwordHash = _passwordHasher.HashPassword(DefaultPassword);
        var superAdminRole = await _context.Roles.FirstAsync(r => r.Name == "SuperAdmin");

        var superAdminEmailStr = "admin@workora.com";
        var email = EmailAddress.Create(superAdminEmailStr);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            _logger.LogInformation("Seeding Root Admin user account: {Email}...", superAdminEmailStr);
            user = User.Create(email, "Super", "Admin", passwordHash);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        var hasRole = await _context.UserRoles.AnyAsync(ur => ur.UserId == user.Id && ur.RoleId == superAdminRole.Id);
        if (!hasRole)
        {
            await _context.UserRoles.AddAsync(UserRole.Create(user.Id, superAdminRole.Id));
            await _context.SaveChangesAsync();
        }
    }
}
