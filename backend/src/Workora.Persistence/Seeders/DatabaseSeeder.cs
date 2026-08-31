using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.ValueObjects;

namespace Workora.Persistence.Seeders;

/// <summary>
/// Seeds foundational Workora platform data.
///
/// This seeder is safe to run multiple times.
/// It creates missing system data and synchronizes
/// system role permission mappings.
/// </summary>
public sealed class DatabaseSeeder
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<DatabaseSeeder> _logger;

    /*
     * IMPORTANT:
     * For production, move this password to:
     *
     * Environment Variable:
     * WORKORA_SUPERADMIN_PASSWORD
     *
     * Do not keep production passwords in source code.
     */
    private const string DefaultPassword = "Admin@123";

    private const string SuperAdminEmail = "admin@workora.com";

    public DatabaseSeeder(
        AppDbContext context,
        IPasswordHasher passwordHasher,
        ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    /// <summary>
    /// Executes all database seeding operations.
    /// </summary>
    public async Task SeedAsync()
    {
        _logger.LogInformation(
            "Starting Workora database seeding process...");

        var canConnect = await _context.Database.CanConnectAsync();

        if (!canConnect)
        {
            _logger.LogWarning(
                "Database connection failed. Seeding skipped.");

            return;
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            // =========================================================
            // 1. SYSTEM PERMISSIONS
            // =========================================================
            await SeedPermissionsAsync();

            // Permissions must be saved before role mappings.
            await _context.SaveChangesAsync();

            // =========================================================
            // 2. SYSTEM ROLES
            // =========================================================
            await SeedRolesAsync();

            await _context.SaveChangesAsync();

            // =========================================================
            // 3. SUBSCRIPTION PLANS
            // =========================================================
            await SeedSubscriptionPlansAsync();

            await _context.SaveChangesAsync();

            // =========================================================
            // 4. ROOT SUPER ADMIN
            // =========================================================
            await SeedSuperAdminUsersAsync();

            await _context.SaveChangesAsync();

            // =========================================================
            // COMMIT
            // =========================================================
            await transaction.CommitAsync();

            _logger.LogInformation(
                "Workora database seeding completed successfully.");
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();

            _logger.LogError(
                ex,
                "Database seeding failed. Transaction rolled back.");

            throw;
        }
    }

    #region Permissions

    /// <summary>
    /// Synchronizes the system permission catalog into the database.
    /// Only missing permissions are added.
    /// </summary>
    private async Task SeedPermissionsAsync()
    {
        _logger.LogInformation(
            "Checking system permissions...");

        var existingCodes = await _context.Permissions
            .Select(p => p.Code)
            .ToListAsync();

        var existingCodeSet =
            existingCodes.ToHashSet(
                StringComparer.OrdinalIgnoreCase);

        var permissionsToAdd =
            PermissionCatalog.SystemPermissions
                .Where(permission =>
                    !existingCodeSet.Contains(permission.Code))
                .Select(permission =>
                    Permission.Create(
                        permission.Code,
                        permission.Name,
                        permission.Module,
                        permission.Description))
                .ToList();

        if (!permissionsToAdd.Any())
        {
            _logger.LogInformation(
                "All system permissions already exist.");

            return;
        }

        await _context.Permissions.AddRangeAsync(
            permissionsToAdd);

        _logger.LogInformation(
            "{Count} new permissions added.",
            permissionsToAdd.Count);
    }

    #endregion

    #region Roles

    /// <summary>
    /// Seeds and synchronizes all Workora system roles.
    /// </summary>
    private async Task SeedRolesAsync()
    {
        _logger.LogInformation(
            "Starting system role seeding...");

        var allPermissions =
            await _context.Permissions
                .AsNoTracking()
                .ToListAsync();

        var permissionMap =
            allPermissions.ToDictionary(
                permission => permission.Code,
                permission => permission.Id,
                StringComparer.OrdinalIgnoreCase);

        var roleDefinitions =
            GetRoleDefinitions(permissionMap);

        foreach (var roleDefinition in roleDefinitions)
        {
            await UpsertRoleWithPermissionsAsync(
                roleDefinition.Name,
                roleDefinition.Description,
                roleDefinition.PermissionCodes,
                permissionMap);
        }

        _logger.LogInformation(
            "System role seeding completed.");
    }

    /// <summary>
    /// Defines all Workora platform system roles.
    /// </summary>
    private List<RoleSeedDefinition> GetRoleDefinitions(
        Dictionary<string, int> permissionMap)
    {
        // =============================================================
        // SUPER ADMIN
        // =============================================================

        var superAdminPermissions =
            permissionMap.Keys.ToList();


        // =============================================================
        // HR ADMIN
        // =============================================================

        var hrAdminPermissions =
            permissionMap.Keys
                .Where(code =>
                    // Authentication
                    code.StartsWith("auth.") ||

                    // Users
                    code.StartsWith("users.") ||

                    // Company Management
                    code.StartsWith("company.") ||
                    code.StartsWith("companies.") ||

                    // Organization
                    code.StartsWith("branches.") ||
                    code.StartsWith("departments.") ||
                    code.StartsWith("designations.") ||

                    // Employees
                    code.StartsWith("employees.") ||

                    // Attendance
                    code.StartsWith("attendance.") ||

                    // Leave
                    code.StartsWith("leave.") ||

                    // Shift
                    code.StartsWith("shifts.") ||

                    // Holidays
                    code.StartsWith("holidays.") ||

                    // Recruitment
                    code.StartsWith("recruitment.") ||

                    // Onboarding
                    code.StartsWith("onboarding.") ||

                    // Performance
                    code.StartsWith("performance.") ||

                    // Training
                    code.StartsWith("training.") ||

                    // Assets
                    code.StartsWith("assets.") ||

                    // Helpdesk
                    code.StartsWith("helpdesk.") ||

                    // Documents
                    code.StartsWith("documents.") ||

                    // Policies
                    code.StartsWith("policies.") ||

                    // Reports
                    code.StartsWith("reports.") ||

                    // Dashboard
                    code.StartsWith("dashboard.") ||

                    // Settings View Only
                    code == "settings.view")
                .ToList();


        // =============================================================
        // FINANCE MANAGER
        // =============================================================

        var financePermissions =
            permissionMap.Keys
                .Where(code =>
                    // Authentication
                    code.StartsWith("auth.") ||

                    // Company Read Access
                    code == "company.view" ||
                    code == "companies.view" ||

                    // Organization Read Access
                    code == "branches.view" ||
                    code == "departments.view" ||
                    code == "designations.view" ||

                    // Employee Read Access
                    code == "employees.view" ||

                    // Salary
                    code.StartsWith("salary.") ||

                    // Payroll
                    code.StartsWith("payroll.") ||

                    // Compliance
                    code.StartsWith("compliance.") ||

                    // Loans
                    code.StartsWith("loans.") ||

                    // Expenses
                    code.StartsWith("expenses.") ||

                    // Reports
                    code.StartsWith("reports.") ||

                    // Dashboard
                    code.StartsWith("dashboard."))
                .ToList();


        // =============================================================
        // MANAGER
        // =============================================================

        var managerPermissions =
            permissionMap.Keys
                .Where(code =>
                    // Authentication
                    code.StartsWith("auth.") ||

                    // Company
                    code == "company.view" ||
                    code == "companies.view" ||

                    // Employee
                    code == "employees.view" ||
                    code == "employees.self" ||

                    // Organization
                    code == "departments.view" ||
                    code == "designations.view" ||
                    code == "branches.view" ||

                    // Shift
                    code == "shifts.view" ||

                    // Holiday
                    code == "holidays.view" ||

                    // Attendance
                    code == "attendance.view" ||
                    code == "attendance.self" ||
                    code == "attendance.approve" ||

                    // Leave
                    code == "leave.view" ||
                    code == "leave.self" ||
                    code == "leave.apply" ||
                    code == "leave.approve" ||

                    // Expenses
                    code == "expenses.view" ||
                    code == "expenses.submit" ||
                    code == "expenses.approve" ||

                    // Tasks
                    code.StartsWith("tasks.") ||

                    // Performance
                    code.StartsWith("performance.") ||

                    // Helpdesk
                    code == "helpdesk.view" ||
                    code == "helpdesk.create" ||

                    // Documents
                    code == "documents.view" ||

                    // Policies
                    code == "policies.view" ||

                    // Reports
                    code == "reports.view" ||

                    // Dashboard
                    code == "dashboard.view" ||

                    // Payroll Self
                    code == "payroll.self" ||

                    // Loans
                    code == "loans.view" ||
                    code == "loans.apply")
                .ToList();


        // =============================================================
        // EMPLOYEE
        // =============================================================

        var employeePermissions =
            permissionMap.Keys
                .Where(code =>
                    // Authentication
                    code.StartsWith("auth.") ||

                    // Employee
                    code == "employees.self" ||
                    code == "employees.view" ||

                    // Organization
                    code == "departments.view" ||
                    code == "designations.view" ||
                    code == "branches.view" ||

                    // Company
                    code == "company.view" ||
                    code == "companies.view" ||

                    // Shift
                    code == "shifts.view" ||

                    // Holidays
                    code == "holidays.view" ||

                    // Training
                    code == "training.view" ||

                    // Attendance
                    code == "attendance.self" ||
                    code == "attendance.view" ||

                    // Leave
                    code == "leave.self" ||
                    code == "leave.apply" ||

                    // Payroll
                    code == "payroll.self" ||

                    // Performance
                    code == "performance.self" ||

                    // Expenses
                    code == "expenses.submit" ||
                    code == "expenses.view" ||

                    // Loans
                    code == "loans.apply" ||
                    code == "loans.view" ||

                    // Tasks
                    code == "tasks.view" ||

                    // Helpdesk
                    code == "helpdesk.create" ||
                    code == "helpdesk.view" ||

                    // Documents
                    code == "documents.view" ||

                    // Policies
                    code == "policies.view" ||

                    // Dashboard
                    code == "dashboard.view")
                .ToList();


        return new List<RoleSeedDefinition>
        {
            new(
                "SuperAdmin",
                "Full platform owner with unrestricted access across all tenants, subscriptions, organizations, and system settings.",
                superAdminPermissions),

            new(
                "HRAdmin",
                "Human resource administrator responsible for workforce lifecycle, employees, attendance, leave, recruitment, and policies.",
                hrAdminPermissions),

            new(
                "FinanceManager",
                "Finance and payroll administrator responsible for compensation, payroll, statutory compliance, loans, and expenses.",
                financePermissions),

            new(
                "Manager",
                "People manager with team management and approval authority.",
                managerPermissions),

            new(
                "Employee",
                "Standard employee self-service role.",
                employeePermissions)
        };
    }

    #endregion

    #region Role Permission Synchronization

    /// <summary>
    /// Creates or updates a system role and synchronizes
    /// its permission mappings.
    /// </summary>
    private async Task UpsertRoleWithPermissionsAsync(
        string roleName,
        string description,
        IEnumerable<string> assignedPermissionCodes,
        Dictionary<string, int> permissionMap)
    {
        var role =
            await _context.Roles
                .Include(r => r.RolePermissions)
                .FirstOrDefaultAsync(
                    r => r.Name == roleName);

        // =============================================================
        // CREATE ROLE
        // =============================================================

        if (role == null)
        {
            _logger.LogInformation(
                "Creating system role: {RoleName}",
                roleName);

            role = Role.Create(
                roleName,
                description,
                isSystemRole: true);

            await _context.Roles.AddAsync(role);

            // Save required to generate Role ID
            await _context.SaveChangesAsync();

            // Reload role with permissions
            role =
                await _context.Roles
                    .Include(r => r.RolePermissions)
                    .FirstAsync(
                        r => r.Id == role.Id);
        }

        // =============================================================
        // DESIRED PERMISSIONS
        // =============================================================

        var desiredPermissionIds =
            assignedPermissionCodes
                .Where(permissionMap.ContainsKey)
                .Select(code => permissionMap[code])
                .Distinct()
                .ToHashSet();

        // =============================================================
        // EXISTING PERMISSIONS
        // =============================================================

        var existingPermissionIds =
            role.RolePermissions
                .Select(rolePermission =>
                    rolePermission.PermissionId)
                .ToHashSet();

        // =============================================================
        // ADD MISSING PERMISSIONS
        // =============================================================

        var permissionsToAdd =
            desiredPermissionIds
                .Where(permissionId =>
                    !existingPermissionIds.Contains(
                        permissionId))
                .Select(permissionId =>
                    RolePermission.Create(
                        role.Id,
                        permissionId))
                .ToList();

        if (permissionsToAdd.Any())
        {
            await _context.RolePermissions
                .AddRangeAsync(permissionsToAdd);
        }

        // =============================================================
        // REMOVE OUTDATED PERMISSIONS
        // =============================================================

        var permissionsToRemove =
            role.RolePermissions
                .Where(rolePermission =>
                    !desiredPermissionIds.Contains(
                        rolePermission.PermissionId))
                .ToList();

        if (permissionsToRemove.Any())
        {
            _context.RolePermissions
                .RemoveRange(permissionsToRemove);
        }

        _logger.LogInformation(
            "Role {RoleName} synchronized. Added: {Added}, Removed: {Removed}",
            roleName,
            permissionsToAdd.Count,
            permissionsToRemove.Count);
    }

    #endregion

    #region Subscription Plans

    /// <summary>
    /// Seeds Workora SaaS subscription plans.
    /// </summary>
    private async Task SeedSubscriptionPlansAsync()
    {
        _logger.LogInformation(
            "Checking subscription plans...");

        var subscriptionPlans =
            GetSubscriptionPlanDefinitions();

        foreach (var planDefinition in subscriptionPlans)
        {
            var existingPlan =
                await _context.SubscriptionPlans
                    .FirstOrDefaultAsync(
                        plan =>
                            plan.Name == planDefinition.Name);

            if (existingPlan != null)
            {
                _logger.LogInformation(
                    "Subscription plan already exists: {PlanName}",
                    planDefinition.Name);

                continue;
            }

            var plan =
                SubscriptionPlan.Create(
                    planDefinition.Name,
                    planDefinition.Description,
                    planDefinition.Price,
                    planDefinition.EmployeeLimit,
                    planDefinition.BillingCycle);

            await _context.SubscriptionPlans
                .AddAsync(plan);

            _logger.LogInformation(
                "Created subscription plan: {PlanName}",
                planDefinition.Name);
        }
    }

    /// <summary>
    /// Defines Workora SaaS subscription plans.
    /// </summary>
    private static List<SubscriptionPlanSeedDefinition>
        GetSubscriptionPlanDefinitions()
    {
        return new List<SubscriptionPlanSeedDefinition>
        {
            new(
                Name: "Starter",
                Description:
                "Ideal for emerging startups and small teams with up to 25 employees.",
                Price: 49.00m,
                EmployeeLimit: 25,
                BillingCycle:
                SubscriptionBillingCycle.Monthly),

            new(
                Name: "Growth",
                Description:
                "Designed for growing organizations with up to 250 employees.",
                Price: 199.00m,
                EmployeeLimit: 250,
                BillingCycle:
                SubscriptionBillingCycle.Monthly),

            new(
                Name: "Enterprise",
                Description:
                "Enterprise-grade HRMS with high employee capacity, advanced features, and dedicated support.",
                Price: 499.00m,
                EmployeeLimit: 10000,
                BillingCycle:
                SubscriptionBillingCycle.Monthly)
        };
    }

    #endregion

    #region Super Admin

    /// <summary>
    /// Seeds the root Workora platform administrator.
    /// </summary>
    private async Task SeedSuperAdminUsersAsync()
    {
        _logger.LogInformation(
            "Checking Root SuperAdmin account...");

        // =============================================================
        // GET SUPER ADMIN ROLE
        // =============================================================

        var superAdminRole =
            await _context.Roles
                .FirstOrDefaultAsync(
                    role =>
                        role.Name == "SuperAdmin");

        if (superAdminRole == null)
        {
            throw new InvalidOperationException(
                "SuperAdmin role was not found. Role seeding failed.");
        }

        // =============================================================
        // CREATE EMAIL VALUE OBJECT
        // =============================================================

        var email =
            EmailAddress.Create(
                SuperAdminEmail);

        // =============================================================
        // FIND USER
        // =============================================================

        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    existingUser =>
                        existingUser.Email == email);

        // =============================================================
        // CREATE USER
        // =============================================================

        if (user == null)
        {
            var password =
                Environment.GetEnvironmentVariable(
                    "WORKORA_SUPERADMIN_PASSWORD")
                ?? DefaultPassword;

            var passwordHash =
                _passwordHasher
                    .HashPassword(password);

            user =
                User.Create(
                    email,
                    "Super",
                    "Admin",
                    passwordHash);

            await _context.Users
                .AddAsync(user);

            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Root SuperAdmin created successfully: {Email}",
                SuperAdminEmail);
        }
        else
        {
            _logger.LogInformation(
                "Root SuperAdmin already exists: {Email}",
                SuperAdminEmail);
        }

        // =============================================================
        // ASSIGN SUPER ADMIN ROLE
        // =============================================================

        var hasRole =
            await _context.UserRoles
                .AnyAsync(userRole =>
                    userRole.UserId == user.Id &&
                    userRole.RoleId == superAdminRole.Id);

        if (!hasRole)
        {
            await _context.UserRoles
                .AddAsync(
                    UserRole.Create(
                        user.Id,
                        superAdminRole.Id));

            _logger.LogInformation(
                "SuperAdmin role assigned to {Email}",
                SuperAdminEmail);
        }
    }

    #endregion

    #region Seed Models

    /// <summary>
    /// Internal system role definition.
    /// </summary>
    private sealed record RoleSeedDefinition(
        string Name,
        string Description,
        IEnumerable<string> PermissionCodes);


    /// <summary>
    /// Internal subscription plan definition.
    /// </summary>
    private sealed record SubscriptionPlanSeedDefinition(
        string Name,
        string Description,
        decimal Price,
        int EmployeeLimit,
        SubscriptionBillingCycle BillingCycle);

    #endregion
}
