namespace Workora.Persistence.Seeders;

/// <summary>
/// Contains compile-time catalog definition of all system permissions across all 37 modules.
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
        // SuperAdmin & Platform Module
        new("superadmin.access", "SuperAdmin Access", "Platform", "Allows full access to SaaS platform management and tenant switching"),

        // Authentication Module
        new("auth.logout", "Logout", "Authentication", "Allows user logout"),
        new("auth.change-password", "Change Password", "Authentication", "Allows self-service password change"),
        new("auth.me", "View Profile", "Authentication", "Allows viewing own authenticated account profile"),
        new("auth.sessions", "List Sessions", "Authentication", "Allows listing active login sessions"),
        new("auth.logout-all", "Logout All Sessions", "Authentication", "Allows revoking all active login sessions"),

        // Users Module
        new("users.view", "View Users", "Users", "Allows viewing system user accounts"),
        new("users.create", "Create User", "Users", "Allows creating new user accounts"),
        new("users.update", "Update User", "Users", "Allows updating user account details"),
        new("users.deactivate", "Deactivate/Activate User", "Users", "Allows deactivating or reactivating user accounts"),
        new("users.assign-roles", "Assign User Roles", "Users", "Allows assigning roles to user accounts"),
        new("users.delete", "Delete User", "Users", "Allows hard deleting user accounts"),
        new("users.manage", "Manage Users / Admin Reset Password", "Users", "Allows administrative actions such as resetting user passwords"),

        // Roles Module
        new("roles.view", "View Roles", "Roles", "Allows viewing roles and role permissions"),
        new("roles.create", "Create Role", "Roles", "Allows creating new system or custom roles"),
        new("roles.update", "Update Role", "Roles", "Allows updating role name and description"),
        new("roles.delete", "Delete Role", "Roles", "Allows deleting non-system custom roles"),
        new("roles.manage-permissions", "Manage Role Permissions", "Roles", "Allows modifying permission assignments of roles"),

        // Permissions Module
        new("permissions.view", "View Permissions Catalog", "Permissions", "Allows viewing the full catalog of available system permissions"),

        // Company & Organization Module
        new("company.view", "View Company Profile", "Organization", "Allows viewing company profiles and legal details"),
        new("company.manage", "Manage Company Profile", "Organization", "Allows creating, editing, and uploading logo for companies"),
        new("companies.view", "View Companies", "Organization", "Allows viewing company profiles"),
        new("companies.manage", "Manage Companies", "Organization", "Allows managing company settings"),

        // Branches Module
        new("branches.view", "View Branches", "Organization", "Allows viewing organization branches"),
        new("branches.manage", "Manage Branches", "Organization", "Allows managing company branches"),

        // Departments Module
        new("departments.view", "View Departments", "Organization", "Allows viewing departments and org chart"),
        new("departments.create", "Create Department", "Organization", "Allows creating departments"),
        new("departments.update", "Update Department", "Organization", "Allows updating departments"),
        new("departments.delete", "Delete Department", "Organization", "Allows deleting departments"),
        new("departments.manage", "Manage Departments", "Organization", "Allows managing department hierarchy"),

        // Designations Module
        new("designations.view", "View Designations", "Organization", "Allows viewing job designations"),
        new("designations.create", "Create Designation", "Organization", "Allows creating job designations"),
        new("designations.update", "Update Designation", "Organization", "Allows updating job designations"),
        new("designations.delete", "Delete Designation", "Organization", "Allows deleting job designations"),
        new("designations.manage", "Manage Designations", "Organization", "Allows managing job designations"),

        // Employees Module
        new("employees.view", "View Employees", "Employees", "Allows viewing employee directory, 360 profiles, and history"),
        new("employees.create", "Create Employee", "Employees", "Allows onboarding new employees"),
        new("employees.update", "Update Employee", "Employees", "Allows editing employee records, bank details, and contacts"),
        new("employees.delete", "Terminate/Delete Employee", "Employees", "Allows terminating and removing employees"),
        new("employees.terminate", "Terminate Employment", "Employees", "Allows terminating employee contracts"),
        new("employees.transfer", "Transfer Employee", "Employees", "Allows departmental/branch transfers"),
        new("employees.self", "Self-Service Employee Profile", "Employees", "Allows employees to view and update their own profile"),

        // Shifts & Rosters Module
        new("shifts.view", "View Shifts", "Attendance", "Allows viewing shift configurations and monthly rosters"),
        new("shifts.manage", "Manage Shifts", "Attendance", "Allows creating, updating, assigning, and swapping shifts"),

        // Holidays Module
        new("holidays.view", "View Holidays", "Attendance", "Allows viewing company holiday calendar"),
        new("holidays.manage", "Manage Holidays", "Attendance", "Allows creating, updating, and importing holidays"),

        // Attendance Module
        new("attendance.view", "View Attendance", "Attendance", "Allows viewing employee attendance records, history, and live presence"),
        new("attendance.manage", "Manage Attendance", "Attendance", "Allows importing punches and configuring policies"),
        new("attendance.approve", "Approve Attendance Corrections", "Attendance", "Allows approving/rejecting punch regularizations"),
        new("attendance.self", "Self-Service Attendance", "Attendance", "Allows self-punch (GPS/Web/Selfie) and regularization requests"),

        // Leave Module
        new("leave.view", "View Leaves", "Leave", "Allows viewing leave requests, balances, and calendar"),
        new("leave.manage", "Manage Leaves", "Leave", "Allows configuring leave types and policies"),
        new("leave.apply", "Apply for Leave", "Leave", "Allows submitting and cancelling leave applications"),
        new("leave.approve", "Approve Leave Requests", "Leave", "Allows managers and HR to approve or reject leaves"),
        new("leave.self", "Self-Service Leave", "Leave", "Allows employees to manage own leaves"),

        // Salary Structure & Payheads Module
        new("salary.view", "View Salary Structures", "Payroll", "Allows viewing salary components and employee templates"),
        new("salary.manage", "Manage Salary Structures", "Payroll", "Allows creating payheads and assigning compensation structures"),

        // Loans & Advances Module
        new("loans.view", "View Loans", "Loans", "Allows viewing employee loan accounts and EMI schedules"),
        new("loans.apply", "Apply for Loan", "Loans", "Allows submitting salary advance/loan requests"),
        new("loans.approve", "Approve Loan Requests", "Loans", "Allows HR and Finance to approve and disburse loans"),

        // Expenses Module
        new("expenses.view", "View Expense Claims", "Expenses", "Allows viewing employee reimbursement claims"),
        new("expenses.submit", "Submit Expense Claim", "Expenses", "Allows submitting claims with receipt attachments"),
        new("expenses.approve", "Approve Expense Claims (Manager)", "Expenses", "Allows reporting managers to approve claims"),
        new("expenses.finance", "Finance Approve Expense Claims", "Expenses", "Allows finance to approve claims for reimbursement"),

        // Field Tracking Module
        new("field.view", "View Field Tracking", "FieldTracking", "Allows viewing live map locations and client visit logs"),
        new("field.track", "Track Field Visits", "FieldTracking", "Allows sending GPS pings and checking in/out of visits"),

        // Payroll Module
        new("payroll.view", "View Payroll", "Payroll", "Allows viewing payroll runs, breakdowns, and payslips"),
        new("payroll.manage", "Manage Payroll", "Payroll", "Allows initializing and updating payroll runs"),
        new("payroll.create", "Create Payroll Run", "Payroll", "Allows creating draft payroll runs"),
        new("payroll.process", "Process Payroll Run", "Payroll", "Allows calculating monthly earnings and deductions"),
        new("payroll.approve", "Approve Payroll Run", "Payroll", "Allows locking and finalizing payroll runs"),
        new("payroll.disburse", "Disburse Payroll", "Payroll", "Allows executing disbursement of approved payroll runs"),
        new("payroll.export", "Export Payroll Disbursement", "Payroll", "Allows exporting bank payment NEFT/RTGS files"),
        new("payroll.self", "Self-Service Payslips", "Payroll", "Allows employees to access their monthly payslips"),

        // Statutory & Compliance Module
        new("compliance.view", "View Statutory Compliance", "Compliance", "Allows viewing PF, ESIC, PT, and TDS computation summaries"),
        new("compliance.manage", "Manage Compliance Settings", "Compliance", "Allows configuring statutory tax rates and verifying declarations"),
        new("compliance.export", "Export Statutory Returns", "Compliance", "Allows exporting EPF ECR, ESIC returns, PT returns, and Form 16"),

        // Assets Module
        new("assets.view", "View Assets", "Assets", "Allows viewing company hardware and equipment inventory"),
        new("assets.manage", "Manage Assets", "Assets", "Allows registering, allocating, returning, and servicing assets"),

        // Tasks Module
        new("tasks.view", "View Tasks", "Tasks", "Allows viewing team tasks and personal assignments"),
        new("tasks.create", "Create Tasks", "Tasks", "Allows delegating and creating operational tasks"),
        new("tasks.manage", "Manage Tasks", "Tasks", "Allows managing task boards, updating statuses, and deleting tasks"),

        // Performance Module
        new("performance.view", "View Performance", "Performance", "Allows viewing appraisal cycles and team goals"),
        new("performance.manage", "Manage Performance", "Performance", "Allows initiating cycles, manager reviews, and finalizing ratings"),
        new("performance.self", "Self-Service Performance", "Performance", "Allows setting goals, self-reviews, and tracking progress"),

        // Training Module
        new("training.view", "View Training", "Training", "Allows viewing corporate training programs"),
        new("training.manage", "Manage Training", "Training", "Allows creating programs and enrolling employees"),

        // Helpdesk Module
        new("helpdesk.view", "View Support Tickets", "Helpdesk", "Allows viewing company helpdesk tickets and queues"),
        new("helpdesk.create", "Create Support Ticket", "Helpdesk", "Allows raising support tickets and adding comments"),
        new("helpdesk.manage", "Manage Helpdesk", "Helpdesk", "Allows assigning, prioritizing, and resolving tickets"),

        // Documents Module
        new("documents.view", "View Documents", "Documents", "Allows viewing and downloading organizational documents"),
        new("documents.manage", "Manage Documents", "Documents", "Allows uploading, verifying, and deleting documents"),

        // Policies Module
        new("policies.view", "View Policies", "Policies", "Allows viewing company policies and acknowledging them"),
        new("policies.manage", "Manage Policies", "Policies", "Allows drafting, publishing versions, and compliance audits"),

        // Recruitment & Pre-Boarding Module
        new("recruitment.view", "View Recruitment", "Recruitment", "Allows viewing job postings, applicants, and pipeline"),
        new("recruitment.create", "Create Job Postings", "Recruitment", "Allows creating job postings"),
        new("recruitment.manage", "Manage Recruitment", "Recruitment", "Allows managing applicants and extending offers"),
        new("recruitment.offer", "Issue Offer Letters", "Recruitment", "Allows creating and sending digital offer letters"),
        new("recruitment.interview", "Conduct Interview", "Recruitment", "Allows submitting interview feedback and ratings"),

        // Onboarding Module
        new("onboarding.view", "View Onboarding", "Onboarding", "Allows viewing onboarding progress and checklists"),
        new("onboarding.manage", "Manage Onboarding", "Onboarding", "Allows configuring joining checklists and verifying items"),

        // Reports & Analytics Module
        new("reports.view", "View Reports", "Reports", "Allows viewing organizational reports and analytics"),
        new("reports.financial", "View Financial Reports", "Reports", "Allows viewing payroll cost and financial trends"),
        new("reports.export", "Export Reports", "Reports", "Allows exporting custom Excel and CSV reports"),

        // Dashboard Module
        new("dashboard.view", "View Dashboard", "Dashboard", "Allows accessing executive dashboard metrics"),

        // System Settings Module
        new("settings.view", "View Settings", "Settings", "Allows viewing system configuration parameters"),
        new("settings.manage", "Manage Settings", "Settings", "Allows updating system configuration parameters"),

        // Audit Logs Module
        new("audit.view", "View Audit Logs", "Audit", "Allows inspecting system security audit trails")
    };
}
