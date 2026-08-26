using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.ValueObjects;

namespace Workora.Persistence.Seeders;

/// <summary>
/// Seeds initial system permissions, tiered roles, multiple tenant companies, organizational units,
/// shifts, leave types, payroll salary structures, job vacancies, and user accounts.
/// All user passwords are standardized to 'Admin@123' for comprehensive end-to-end testing.
/// </summary>
public class DatabaseSeeder
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<DatabaseSeeder> _logger;

    /// <summary>
    /// Default test password across all seeded users.
    /// </summary>
    private const string DefaultPassword = "Admin@123";

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
    /// Seeds the database with default records.
    /// </summary>
    public async Task SeedAsync()
    {
        try
        {
            if (await _context.Database.CanConnectAsync())
            {
                _logger.LogInformation("Starting database seeding process...");

                // 1. Seed Permissions Catalog
                await SeedPermissionsAsync();

                // 2. Seed System Roles with appropriate Permission Mappings
                await SeedRolesAsync();

                // 3. Seed Subscription Plans (SuperAdmin module)
                await SeedSubscriptionPlansAsync();

                // 4. Seed Super Admin User
                await SeedSuperAdminUsersAsync();

                // 5. Seed Multiple Tenant Companies (Acme Corp, Nexus Global, Vertex Logistics)
                await SeedCompaniesAndWorkforceAsync();

                _logger.LogInformation("Database seeding completed successfully.");
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
    /// Seeds core tiered system roles (SuperAdmin, HRAdmin, FinanceManager, Manager, Employee).
    /// </summary>
    private async Task SeedRolesAsync()
    {
        var allPermissions = await _context.Permissions.ToListAsync();
        var permissionMap = allPermissions.ToDictionary(p => p.Code, p => p.Id, StringComparer.OrdinalIgnoreCase);

        // 1. SuperAdmin Role
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
    /// Seeds SuperAdmin subscription plans.
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
    /// Seeds platform SuperAdmin user accounts.
    /// </summary>
    private async Task SeedSuperAdminUsersAsync()
    {
        var passwordHash = _passwordHasher.HashPassword(DefaultPassword);
        var superAdminRole = await _context.Roles.FirstAsync(r => r.Name == "SuperAdmin");

        var superAdminEmails = new[] { "superadmin@workora.com", "admin@workora.com" };

        foreach (var emailStr in superAdminEmails)
        {
            var email = EmailAddress.Create(emailStr);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
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

    /// <summary>
    /// Seeds multiple companies with branches, departments, designations, shifts, leave types,
    /// salary structures, and employees with linked user accounts (all password Admin@123).
    /// </summary>
    private async Task SeedCompaniesAndWorkforceAsync()
    {
        var passwordHash = _passwordHasher.HashPassword(DefaultPassword);
        var hrRole = await _context.Roles.FirstAsync(r => r.Name == "HRAdmin");
        var finRole = await _context.Roles.FirstAsync(r => r.Name == "FinanceManager");
        var mgrRole = await _context.Roles.FirstAsync(r => r.Name == "Manager");
        var empRole = await _context.Roles.FirstAsync(r => r.Name == "Employee");

        // ==========================================
        // COMPANY 1: ACME CORPORATION (Code: ACME)
        // ==========================================
        var acme = await _context.Companies.FirstOrDefaultAsync(c => c.Code == "ACME");
        if (acme == null)
        {
            _logger.LogInformation("Seeding Company: Acme Corporation...");
            acme = Company.Create(
                name: "Acme Corporation",
                code: "ACME",
                registrationNumber: "US-DEL-9845210",
                taxId: "EIN-88-2940192",
                email: "contact@acme.com",
                phone: "+1 (415) 555-0199",
                website: "https://acme.example.com",
                fiscalYearStartMonth: 1,
                currency: "USD",
                address: "500 Howard Street, Suite 400, San Francisco, CA 94105, USA"
            );
            await _context.Companies.AddAsync(acme);
            await _context.SaveChangesAsync();
        }

        // Acme Branches
        var acmeHq = await GetOrCreateBranchAsync(acme.Id, "San Francisco HQ", "ACME-SF", "San Francisco", "500 Howard Street, SF, CA", "America/Los_Angeles", true);
        var acmeNy = await GetOrCreateBranchAsync(acme.Id, "New York Hub", "ACME-NY", "New York", "350 5th Ave, New York, NY", "America/New_York", false);
        var acmeLondon = await GetOrCreateBranchAsync(acme.Id, "London Office", "ACME-LDN", "London", "100 Bishopsgate, London", "Europe/London", false);

        // Acme Departments
        var acmeEng = await GetOrCreateDepartmentAsync(acme.Id, "ENG", "Engineering");
        var acmeHr = await GetOrCreateDepartmentAsync(acme.Id, "HR", "Human Resources");
        var acmeFin = await GetOrCreateDepartmentAsync(acme.Id, "FIN", "Finance & Accounting");
        var acmePrd = await GetOrCreateDepartmentAsync(acme.Id, "PRD", "Product & Design");
        var acmeOps = await GetOrCreateDepartmentAsync(acme.Id, "OPS", "Operations");

        // Acme Designations
        var desVpEng = await GetOrCreateDesignationAsync(acmeEng.Id, "VP of Engineering", 5, "L6", "Leads technical architecture and engineering organization.");
        var desMgrEng = await GetOrCreateDesignationAsync(acmeEng.Id, "Engineering Manager", 4, "L5", "Directs software development team execution.");
        var desSrEng = await GetOrCreateDesignationAsync(acmeEng.Id, "Senior FullStack Engineer", 3, "L4", "Architects core platform backend and frontend features.");
        var desJrEng = await GetOrCreateDesignationAsync(acmeEng.Id, "Frontend Engineer", 2, "L3", "Builds intuitive UI and frontend user experiences.");
        var desHrDir = await GetOrCreateDesignationAsync(acmeHr.Id, "HR Director", 5, "L6", "Directs global people operations, culture, and talent strategy.");
        var desFinCtrl = await GetOrCreateDesignationAsync(acmeFin.Id, "Finance Controller", 4, "L5", "Oversees financial disbursements, statutory returns, and audits.");
        var desPrdDsgn = await GetOrCreateDesignationAsync(acmePrd.Id, "Lead Product Designer", 3, "L4", "Drives UI/UX design systems and product interaction.");

        // Acme Shifts
        await GetOrCreateShiftAsync(acme.Id, "General Day Shift", "ACME-GEN", new TimeOnly(9, 0), new TimeOnly(18, 0));
        await GetOrCreateShiftAsync(acme.Id, "Morning Shift", "ACME-MORN", new TimeOnly(7, 0), new TimeOnly(16, 0));
        await GetOrCreateShiftAsync(acme.Id, "Night Shift", "ACME-NGHT", new TimeOnly(21, 0), new TimeOnly(6, 0), spansMidnight: true);

        // Acme Leave Types
        var acmeAl = await GetOrCreateLeaveTypeAsync(acme.Id, "Annual Paid Leave", "AL", 18);
        var acmeSl = await GetOrCreateLeaveTypeAsync(acme.Id, "Sick / Medical Leave", "SL", 10);
        var acmeCl = await GetOrCreateLeaveTypeAsync(acme.Id, "Casual Leave", "CL", 7);

        // Acme Holidays
        await GetOrCreateHolidayAsync(acme.Id, "New Year's Day", new DateOnly(2026, 1, 1));
        await GetOrCreateHolidayAsync(acme.Id, "Memorial Day", new DateOnly(2026, 5, 25));
        await GetOrCreateHolidayAsync(acme.Id, "Independence Day", new DateOnly(2026, 7, 4));
        await GetOrCreateHolidayAsync(acme.Id, "Thanksgiving Day", new DateOnly(2026, 11, 26));
        await GetOrCreateHolidayAsync(acme.Id, "Christmas Day", new DateOnly(2026, 12, 25));

        // Acme Salary Structure
        var acmeSalaryStruct = await GetOrCreateSalaryStructureAsync(acme.Id, "US Standard Tech Structure", "Base compensation with 401k and standard allowances.");

        // Acme Employees & Users
        // 1. HR Admin (hr@acme.com)
        var empHelena = await SeedEmployeeWithUserAsync(
            emailStr: "hr@acme.com",
            firstName: "Helena",
            lastName: "Vance",
            employeeCode: "ACME-0001",
            nationalId: "SSN-998-12-3041",
            phone: "+1 415-555-1001",
            dob: new DateOnly(1988, 4, 12),
            hireDate: new DateOnly(2022, 1, 15),
            gender: Gender.Female,
            deptId: acmeHr.Id,
            desigId: desHrDir.Id,
            branchId: acmeHq.Id,
            roleId: hrRole.Id,
            passwordHash: passwordHash
        );

        // 2. Finance Manager (finance@acme.com)
        var empFelix = await SeedEmployeeWithUserAsync(
            emailStr: "finance@acme.com",
            firstName: "Felix",
            lastName: "Drake",
            employeeCode: "ACME-0002",
            nationalId: "SSN-998-12-3042",
            phone: "+1 415-555-1002",
            dob: new DateOnly(1985, 9, 23),
            hireDate: new DateOnly(2022, 3, 1),
            gender: Gender.Male,
            deptId: acmeFin.Id,
            desigId: desFinCtrl.Id,
            branchId: acmeHq.Id,
            roleId: finRole.Id,
            passwordHash: passwordHash
        );

        // 3. Engineering Manager (manager@acme.com)
        var empMarcus = await SeedEmployeeWithUserAsync(
            emailStr: "manager@acme.com",
            firstName: "Marcus",
            lastName: "Sterling",
            employeeCode: "ACME-0003",
            nationalId: "SSN-998-12-3043",
            phone: "+1 415-555-1003",
            dob: new DateOnly(1987, 11, 5),
            hireDate: new DateOnly(2022, 6, 15),
            gender: Gender.Male,
            deptId: acmeEng.Id,
            desigId: desMgrEng.Id,
            branchId: acmeHq.Id,
            roleId: mgrRole.Id,
            passwordHash: passwordHash
        );

        // 4. Senior Developer (employee@acme.com)
        var empEthan = await SeedEmployeeWithUserAsync(
            emailStr: "employee@acme.com",
            firstName: "Ethan",
            lastName: "Hayes",
            employeeCode: "ACME-0004",
            nationalId: "SSN-998-12-3044",
            phone: "+1 415-555-1004",
            dob: new DateOnly(1993, 2, 18),
            hireDate: new DateOnly(2023, 1, 10),
            gender: Gender.Male,
            deptId: acmeEng.Id,
            desigId: desSrEng.Id,
            branchId: acmeHq.Id,
            roleId: empRole.Id,
            managerId: empMarcus.Id,
            passwordHash: passwordHash
        );

        // 5. Frontend Engineer (john.doe@acme.com)
        await SeedEmployeeWithUserAsync(
            emailStr: "john.doe@acme.com",
            firstName: "John",
            lastName: "Doe",
            employeeCode: "ACME-0005",
            nationalId: "SSN-998-12-3045",
            phone: "+1 415-555-1005",
            dob: new DateOnly(1995, 7, 22),
            hireDate: new DateOnly(2023, 5, 20),
            gender: Gender.Male,
            deptId: acmeEng.Id,
            desigId: desJrEng.Id,
            branchId: acmeHq.Id,
            roleId: empRole.Id,
            managerId: empMarcus.Id,
            passwordHash: passwordHash
        );

        // 6. Lead Product Designer (sarah.connor@acme.com)
        await SeedEmployeeWithUserAsync(
            emailStr: "sarah.connor@acme.com",
            firstName: "Sarah",
            lastName: "Connor",
            employeeCode: "ACME-0006",
            nationalId: "SSN-998-12-3046",
            phone: "+1 415-555-1006",
            dob: new DateOnly(1991, 12, 3),
            hireDate: new DateOnly(2023, 4, 1),
            gender: Gender.Female,
            deptId: acmePrd.Id,
            desigId: desPrdDsgn.Id,
            branchId: acmeNy.Id,
            roleId: empRole.Id,
            passwordHash: passwordHash
        );

        // Seed Sample Leave Balances for Acme Employees
        await SeedLeaveBalancesForEmployeeAsync(empEthan.Id, new[] { acmeAl, acmeSl, acmeCl });

        // ==========================================
        // COMPANY 2: NEXUS GLOBAL ENTERPRISES (Code: NEXUS)
        // ==========================================
        var nexus = await _context.Companies.FirstOrDefaultAsync(c => c.Code == "NEXUS");
        if (nexus == null)
        {
            _logger.LogInformation("Seeding Company: Nexus Global Enterprises...");
            nexus = Company.Create(
                name: "Nexus Global Enterprises",
                code: "NEXUS",
                registrationNumber: "IN-MH-2021-998412",
                taxId: "GSTIN-27AAACN1234F1Z5",
                email: "info@nexusglobal.com",
                phone: "+91 80 4455 6600",
                website: "https://nexusglobal.example.com",
                fiscalYearStartMonth: 4,
                currency: "INR",
                address: "Embassy TechVillage, Outer Ring Road, Bangalore 560103, India"
            );
            await _context.Companies.AddAsync(nexus);
            await _context.SaveChangesAsync();
        }

        var nexusBlr = await GetOrCreateBranchAsync(nexus.Id, "Bangalore Tech Park", "NEXUS-BLR", "Bangalore", "Embassy TechVillage, Bangalore", "Asia/Kolkata", true);
        var nexusMum = await GetOrCreateBranchAsync(nexus.Id, "Mumbai FinTech Hub", "NEXUS-MUM", "Mumbai", "BKC, Bandra East, Mumbai", "Asia/Kolkata", false);

        var nexusTech = await GetOrCreateDepartmentAsync(nexus.Id, "TECH", "Information Technology");
        var nexusPeople = await GetOrCreateDepartmentAsync(nexus.Id, "PEOPLE", "People & Culture");
        var nexusFin = await GetOrCreateDepartmentAsync(nexus.Id, "FIN", "Finance & Accounts");

        var desNexusVp = await GetOrCreateDesignationAsync(nexusTech.Id, "Director of Technology", 5, "L6", "Leads offshore development and cloud services.");
        var desNexusLead = await GetOrCreateDesignationAsync(nexusTech.Id, "Lead Cloud Architect", 4, "L5", "Designs multi-cloud infrastructure and DevOps pipelines.");
        var desNexusDev = await GetOrCreateDesignationAsync(nexusTech.Id, "Senior Backend Engineer", 3, "L4", "Develops enterprise microservices and APIs.");
        var desNexusHr = await GetOrCreateDesignationAsync(nexusPeople.Id, "Head of People Operations", 5, "L6", "Leads talent acquisition and employee relations.");

        await GetOrCreateShiftAsync(nexus.Id, "India General Shift", "NEXUS-GEN", new TimeOnly(9, 30), new TimeOnly(18, 30));

        var nexusAl = await GetOrCreateLeaveTypeAsync(nexus.Id, "Earned Leave (EL)", "EL", 18);
        var nexusCl = await GetOrCreateLeaveTypeAsync(nexus.Id, "Casual / Sick Leave", "CSL", 12);

        await GetOrCreateHolidayAsync(nexus.Id, "Republic Day", new DateOnly(2026, 1, 26));
        await GetOrCreateHolidayAsync(nexus.Id, "Independence Day", new DateOnly(2026, 8, 15));
        await GetOrCreateHolidayAsync(nexus.Id, "Diwali", new DateOnly(2026, 11, 8));

        // Nexus Users & Employees
        // 1. HR Admin (hr@nexus.com)
        await SeedEmployeeWithUserAsync(
            emailStr: "hr@nexus.com",
            firstName: "Nisha",
            lastName: "Sharma",
            employeeCode: "NEXUS-0001",
            nationalId: "AADHAAR-8839-4401-2290",
            phone: "+91 98200 12345",
            dob: new DateOnly(1989, 8, 14),
            hireDate: new DateOnly(2021, 6, 1),
            gender: Gender.Female,
            deptId: nexusPeople.Id,
            desigId: desNexusHr.Id,
            branchId: nexusBlr.Id,
            roleId: hrRole.Id,
            passwordHash: passwordHash
        );

        // 2. Tech Lead / Manager (manager@nexus.com)
        var empRohan = await SeedEmployeeWithUserAsync(
            emailStr: "manager@nexus.com",
            firstName: "Rohan",
            lastName: "Mehta",
            employeeCode: "NEXUS-0002",
            nationalId: "AADHAAR-8839-4401-2291",
            phone: "+91 98200 12346",
            dob: new DateOnly(1986, 3, 29),
            hireDate: new DateOnly(2021, 8, 15),
            gender: Gender.Male,
            deptId: nexusTech.Id,
            desigId: desNexusLead.Id,
            branchId: nexusBlr.Id,
            roleId: mgrRole.Id,
            passwordHash: passwordHash
        );

        // 3. Senior Backend Dev (employee@nexus.com)
        var empAarav = await SeedEmployeeWithUserAsync(
            emailStr: "employee@nexus.com",
            firstName: "Aarav",
            lastName: "Patel",
            employeeCode: "NEXUS-0003",
            nationalId: "AADHAAR-8839-4401-2292",
            phone: "+91 98200 12347",
            dob: new DateOnly(1994, 5, 11),
            hireDate: new DateOnly(2022, 2, 1),
            gender: Gender.Male,
            deptId: nexusTech.Id,
            desigId: desNexusDev.Id,
            branchId: nexusBlr.Id,
            roleId: empRole.Id,
            managerId: empRohan.Id,
            passwordHash: passwordHash
        );

        await SeedLeaveBalancesForEmployeeAsync(empAarav.Id, new[] { nexusAl, nexusCl });

        // ==========================================
        // COMPANY 3: VERTEX LOGISTICS (Code: VTX)
        // ==========================================
        var vertex = await _context.Companies.FirstOrDefaultAsync(c => c.Code == "VTX");
        if (vertex == null)
        {
            _logger.LogInformation("Seeding Company: Vertex Logistics...");
            vertex = Company.Create(
                name: "Vertex Logistics & Distribution",
                code: "VTX",
                registrationNumber: "DE-BER-HRB-883921",
                taxId: "DE-VAT-99882211",
                email: "contact@vertex-logistics.de",
                phone: "+49 30 5566 7788",
                website: "https://vertex.example.de",
                fiscalYearStartMonth: 1,
                currency: "EUR",
                address: "Potsdamer Platz 1, 10785 Berlin, Germany"
            );
            await _context.Companies.AddAsync(vertex);
            await _context.SaveChangesAsync();
        }

        var vtxBerlin = await GetOrCreateBranchAsync(vertex.Id, "Berlin Logistics Hub", "VTX-BER", "Berlin", "Potsdamer Platz 1, Berlin", "Europe/Berlin", true);
        var vtxOps = await GetOrCreateDepartmentAsync(vertex.Id, "OPS", "Supply Chain & Fleet");
        var desVtxDir = await GetOrCreateDesignationAsync(vtxOps.Id, "Director of Logistics", 5, "L6", "Directs pan-European fleet operations.");
        var desVtxCoord = await GetOrCreateDesignationAsync(vtxOps.Id, "Fleet Coordinator", 2, "L3", "Tracks real-time dispatch routes and freight.");

        await GetOrCreateShiftAsync(vertex.Id, "Europe Day Shift", "VTX-DAY", new TimeOnly(8, 0), new TimeOnly(17, 0));

        // Vertex Users & Employees
        await SeedEmployeeWithUserAsync(
            emailStr: "admin@vertex.com",
            firstName: "Viktor",
            lastName: "Becker",
            employeeCode: "VTX-0001",
            nationalId: "DE-ID-99281920",
            phone: "+49 170 1234567",
            dob: new DateOnly(1982, 10, 19),
            hireDate: new DateOnly(2020, 1, 10),
            gender: Gender.Male,
            deptId: vtxOps.Id,
            desigId: desVtxDir.Id,
            branchId: vtxBerlin.Id,
            roleId: hrRole.Id,
            passwordHash: passwordHash
        );

        await SeedEmployeeWithUserAsync(
            emailStr: "employee@vertex.com",
            firstName: "Lukas",
            lastName: "Schmidt",
            employeeCode: "VTX-0002",
            nationalId: "DE-ID-99281921",
            phone: "+49 170 1234568",
            dob: new DateOnly(1996, 6, 8),
            hireDate: new DateOnly(2023, 3, 1),
            gender: Gender.Male,
            deptId: vtxOps.Id,
            desigId: desVtxCoord.Id,
            branchId: vtxBerlin.Id,
            roleId: empRole.Id,
            passwordHash: passwordHash
        );
    }

    private async Task<Branch> GetOrCreateBranchAsync(int companyId, string name, string code, string location, string address, string timezone, bool isHeadOffice)
    {
        var branch = await _context.Branches.FirstOrDefaultAsync(b => b.CompanyId == companyId && b.Code == code);
        if (branch == null)
        {
            branch = Branch.Create(companyId, name, code, location, address, timezone, isHeadOffice);
            await _context.Branches.AddAsync(branch);
            await _context.SaveChangesAsync();
        }
        return branch;
    }

    private async Task<Department> GetOrCreateDepartmentAsync(int companyId, string code, string name)
    {
        var dept = await _context.Departments.FirstOrDefaultAsync(d => d.CompanyId == companyId && d.Code == code);
        if (dept == null)
        {
            dept = Department.Create(companyId, code, name);
            await _context.Departments.AddAsync(dept);
            await _context.SaveChangesAsync();
        }
        return dept;
    }

    private async Task<Designation> GetOrCreateDesignationAsync(int departmentId, string title, int level, string grade, string description)
    {
        var des = await _context.Designations.FirstOrDefaultAsync(d => d.DepartmentId == departmentId && d.Title == title);
        if (des == null)
        {
            des = Designation.Create(departmentId, title, level, grade, description);
            await _context.Designations.AddAsync(des);
            await _context.SaveChangesAsync();
        }
        return des;
    }

    private async Task<Shift> GetOrCreateShiftAsync(int companyId, string name, string code, TimeOnly start, TimeOnly end, bool spansMidnight = false)
    {
        var shift = await _context.Shifts.FirstOrDefaultAsync(s => s.CompanyId == companyId && s.Code == code);
        if (shift == null)
        {
            shift = Shift.Create(companyId, name, code, start, end, spansMidnight);
            await _context.Shifts.AddAsync(shift);
            await _context.SaveChangesAsync();
        }
        return shift;
    }

    private async Task<LeaveType> GetOrCreateLeaveTypeAsync(int companyId, string name, string code, decimal annualQuota)
    {
        var lt = await _context.LeaveTypes.FirstOrDefaultAsync(l => l.CompanyId == companyId && l.Code == code);
        if (lt == null)
        {
            lt = LeaveType.Create(companyId, name, code, annualQuota);
            await _context.LeaveTypes.AddAsync(lt);
            await _context.SaveChangesAsync();
        }
        return lt;
    }

    private async Task<Holiday> GetOrCreateHolidayAsync(int companyId, string name, DateOnly date)
    {
        var h = await _context.Holidays.FirstOrDefaultAsync(x => x.CompanyId == companyId && x.Date == date);
        if (h == null)
        {
            h = Holiday.Create(companyId, name, date);
            await _context.Holidays.AddAsync(h);
            await _context.SaveChangesAsync();
        }
        return h;
    }

    private async Task<SalaryStructure> GetOrCreateSalaryStructureAsync(int companyId, string name, string description)
    {
        var s = await _context.SalaryStructures.FirstOrDefaultAsync(x => x.CompanyId == companyId && x.Name == name);
        if (s == null)
        {
            s = SalaryStructure.Create(companyId, name, description);
            await _context.SalaryStructures.AddAsync(s);
            await _context.SaveChangesAsync();
        }
        return s;
    }

    private async Task<Employee> SeedEmployeeWithUserAsync(
        string emailStr,
        string firstName,
        string lastName,
        string employeeCode,
        string nationalId,
        string phone,
        DateOnly dob,
        DateOnly hireDate,
        Gender gender,
        int deptId,
        int desigId,
        int branchId,
        int roleId,
        string passwordHash,
        int? managerId = null)
    {
        var email = EmailAddress.Create(emailStr);

        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == email);
        if (employee == null)
        {
            employee = Employee.Create(
                employeeCode: employeeCode,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                nationalId: nationalId,
                dateOfBirth: dob,
                gender: gender,
                maritalStatus: MaritalStatus.Single,
                hireDate: hireDate,
                departmentId: deptId,
                designationId: desigId,
                branchId: branchId,
                managerId: managerId,
                employmentStatus: EmploymentStatus.Active,
                employmentType: EmploymentType.FullTime
            );

            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            user = User.Create(email, firstName, lastName, passwordHash, employee.Id);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        employee.LinkUser(user.Id);
        _context.Employees.Update(employee);
        await _context.SaveChangesAsync();

        var hasRole = await _context.UserRoles.AnyAsync(ur => ur.UserId == user.Id && ur.RoleId == roleId);
        if (!hasRole)
        {
            await _context.UserRoles.AddAsync(UserRole.Create(user.Id, roleId));
            await _context.SaveChangesAsync();
        }

        return employee;
    }

    private async Task SeedLeaveBalancesForEmployeeAsync(int employeeId, IEnumerable<LeaveType> leaveTypes)
    {
        var currentYear = DateTime.UtcNow.Year;
        foreach (var lt in leaveTypes)
        {
            var exists = await _context.LeaveBalances.AnyAsync(b => b.EmployeeId == employeeId && b.LeaveTypeId == lt.Id && b.Year == currentYear);
            if (!exists)
            {
                var bal = LeaveBalance.Create(employeeId, lt.Id, currentYear, lt.AnnualQuota);
                await _context.LeaveBalances.AddAsync(bal);
            }
        }
        await _context.SaveChangesAsync();
    }
}
