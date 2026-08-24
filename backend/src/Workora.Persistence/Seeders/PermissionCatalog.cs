namespace Workora.Persistence.Seeders;

/// <summary>
/// Contains compile-time catalog definition of all system permissions.
/// </summary>
public static class PermissionCatalog
{
    /// <summary>
    /// Definition record for seeding permissions.
    /// </summary>
    /// <param name="Code">The permission unique code.</param>
    /// <param name="Name">The display name.</param>
    /// <param name="Module">The parent module name.</param>
    /// <param name="Description">The optional description.</param>
    public record PermissionDefinition(string Code, string Name, string Module, string Description);

    /// <summary>
    /// Gets all pre-configured system permissions.
    /// </summary>
    public static readonly IReadOnlyList<PermissionDefinition> SystemPermissions = new List<PermissionDefinition>
    {
        // Authentication Module (9.1)
        new("auth.logout", "Logout", "Authentication", "Allows user logout"),
        new("auth.change-password", "Change Password", "Authentication", "Allows self-service password change"),
        new("auth.me", "View Profile", "Authentication", "Allows viewing own authenticated account profile"),
        new("auth.sessions", "List Sessions", "Authentication", "Allows listing active login sessions"),
        new("auth.logout-all", "Logout All Sessions", "Authentication", "Allows revoking all active login sessions"),

        // Users Module (9.2)
        new("users.view", "View Users", "Users", "Allows viewing system user accounts"),
        new("users.create", "Create User", "Users", "Allows creating new user accounts"),
        new("users.update", "Update User", "Users", "Allows updating user account details"),
        new("users.deactivate", "Deactivate/Activate User", "Users", "Allows deactivating or reactivating user accounts"),
        new("users.assign-roles", "Assign User Roles", "Users", "Allows assigning roles to user accounts"),
        new("users.delete", "Delete User", "Users", "Allows hard deleting user accounts"),
        new("users.manage", "Manage Users / Admin Reset Password", "Users", "Allows administrative actions such as resetting user passwords"),

        // Roles Module (9.3)
        new("roles.view", "View Roles", "Roles", "Allows viewing roles and role permissions"),
        new("roles.create", "Create Role", "Roles", "Allows creating new system or custom roles"),
        new("roles.update", "Update Role", "Roles", "Allows updating role name and description"),
        new("roles.delete", "Delete Role", "Roles", "Allows deleting non-system custom roles"),
        new("roles.manage-permissions", "Manage Role Permissions", "Roles", "Allows modifying permission assignments of roles"),

        // Permissions Module (9.4)
        new("permissions.view", "View Permissions Catalog", "Permissions", "Allows viewing the full catalog of available system permissions"),

        // Company & Structure Modules (9.5, 9.6, 9.26, 9.27)
        new("companies.view", "View Companies", "Organization", "Allows viewing company profiles"),
        new("companies.manage", "Manage Companies", "Organization", "Allows creating and editing companies"),
        new("branches.view", "View Branches", "Organization", "Allows viewing organization branches"),
        new("branches.manage", "Manage Branches", "Organization", "Allows managing company branches"),
        new("departments.view", "View Departments", "Organization", "Allows viewing departments"),
        new("departments.manage", "Manage Departments", "Organization", "Allows managing departments"),
        new("designations.view", "View Designations", "Organization", "Allows viewing job designations"),
        new("designations.manage", "Manage Designations", "Organization", "Allows managing job designations"),

        // Employees Module (9.7)
        new("employees.view", "View Employees", "Employees", "Allows viewing employee directory and profiles"),
        new("employees.create", "Create Employee", "Employees", "Allows onboarding new employees"),
        new("employees.update", "Update Employee", "Employees", "Allows editing employee records and emergency contacts"),
        new("employees.delete", "Terminate/Reactivate Employee", "Employees", "Allows offboarding, terminating, and reactivating employees"),
        new("employees.self", "Self-Service Employee Profile", "Employees", "Allows employees to view and update their own profile"),

        // Shifts Module (9.8)
        new("shifts.view", "View Shifts", "Attendance", "Allows viewing shift configurations"),
        new("shifts.manage", "Manage Shifts", "Attendance", "Allows creating, updating, and assigning shifts"),

        // Holidays Module (9.9)
        new("holidays.view", "View Holidays", "Attendance", "Allows viewing company holiday calendar"),
        new("holidays.manage", "Manage Holidays", "Attendance", "Allows configuring holidays"),

        // Attendance Module (9.10)
        new("attendance.view", "View Attendance", "Attendance", "Allows viewing employee attendance records and history"),
        new("attendance.manage", "Manage Attendance", "Attendance", "Allows approving corrections and importing attendance"),
        new("attendance.self", "Self-Service Attendance", "Attendance", "Allows check-in, check-out, and correction requests"),

        // Leave Module (9.11)
        new("leave.view", "View Leaves", "Leave", "Allows viewing leave requests, balances, and calendar"),
        new("leave.manage", "Manage Leaves", "Leave", "Allows configuring leave types and approving/rejecting leave applications"),
        new("leave.self", "Self-Service Leave", "Leave", "Allows submitting and cancelling own leave requests"),

        // Recruitment Module (9.12 - 9.16)
        new("recruitment.view", "View Recruitment", "Recruitment", "Allows viewing job postings, applicants, and pipeline"),
        new("recruitment.manage", "Manage Recruitment", "Recruitment", "Allows managing jobs, applicants, and extending offers"),
        new("recruitment.interview", "Conduct Interview", "Recruitment", "Allows submitting interview feedback and ratings"),

        // Performance Module (9.17 - 9.18)
        new("performance.view", "View Performance", "Performance", "Allows viewing appraisals and goals"),
        new("performance.manage", "Manage Performance", "Performance", "Allows initiating and finalizing appraisal reviews"),
        new("performance.self", "Self-Service Performance", "Performance", "Allows submitting self-reviews and tracking personal goals"),

        // Training Module (9.19)
        new("training.view", "View Training", "Training", "Allows viewing corporate training programs"),
        new("training.manage", "Manage Training", "Training", "Allows creating programs and enrolling employees"),

        // Assets Module (9.20)
        new("assets.view", "View Assets", "Assets", "Allows viewing company hardware and equipment inventory"),
        new("assets.manage", "Manage Assets", "Assets", "Allows creating, checking out, and returning assets"),

        // Documents Module (9.21)
        new("documents.view", "View Documents", "Documents", "Allows viewing and downloading organizational documents"),
        new("documents.manage", "Manage Documents", "Documents", "Allows uploading and deleting documents"),

        // Policies Module (9.22)
        new("policies.view", "View Policies", "Policies", "Allows viewing company policies and acknowledging them"),
        new("policies.manage", "Manage Policies", "Policies", "Allows drafting and managing corporate policies"),

        // System Settings Module (9.24)
        new("settings.view", "View Settings", "Settings", "Allows viewing system configuration parameters"),
        new("settings.manage", "Manage Settings", "Settings", "Allows updating system configuration parameters"),

        // Audit Logs Module (9.25)
        new("audit.view", "View Audit Logs", "Audit", "Allows inspecting system security audit trails"),

        // Payroll Module (9.28 - 9.29)
        new("payroll.view", "View Payroll", "Payroll", "Allows viewing salary structures, payroll runs, and payslips"),
        new("payroll.manage", "Manage Payroll", "Payroll", "Allows creating salary structures and initiating payroll cycles"),
        new("payroll.approve", "Approve Payroll", "Payroll", "Allows approving calculated payroll runs"),
        new("payroll.disburse", "Disburse Payroll", "Payroll", "Allows executing disbursement of approved payroll runs"),
        new("payroll.self", "Self-Service Payslips", "Payroll", "Allows employees to access their monthly payslips"),

        // Reports Module (9.30)
        new("reports.view", "View Reports", "Reports", "Allows viewing organizational reports and analytics"),

        // Dashboard Module (9.31)
        new("dashboard.view", "View Dashboard", "Dashboard", "Allows accessing executive dashboard metrics")
    };
}
