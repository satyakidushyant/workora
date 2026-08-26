/**
 * Permission Definition structure matching Workora Permission Catalog.
 */
export interface PermissionItem {
  readonly code: string;
  readonly name: string;
  readonly module: string;
  readonly description?: string;
}

/**
 * Compile-time catalog definition of all system permissions across all modules,
 * matching backend Workora.Persistence.Seeders.PermissionCatalog.cs.
 */
export const PERMISSION_CATALOG: readonly PermissionItem[] = [
  // SuperAdmin & Platform Module
  { code: 'superadmin.access', name: 'SuperAdmin Access', module: 'Platform', description: 'Allows full access to SaaS platform management and tenant switching' },

  // Authentication Module
  { code: 'auth.logout', name: 'Logout', module: 'Authentication', description: 'Allows user logout' },
  { code: 'auth.change-password', name: 'Change Password', module: 'Authentication', description: 'Allows self-service password change' },
  { code: 'auth.me', name: 'View Profile', module: 'Authentication', description: 'Allows viewing own authenticated account profile' },
  { code: 'auth.sessions', name: 'List Sessions', module: 'Authentication', description: 'Allows listing active login sessions' },
  { code: 'auth.logout-all', name: 'Logout All Sessions', module: 'Authentication', description: 'Allows revoking all active login sessions' },

  // Users Module
  { code: 'users.view', name: 'View Users', module: 'Users', description: 'Allows viewing system user accounts' },
  { code: 'users.create', name: 'Create User', module: 'Users', description: 'Allows creating new user accounts' },
  { code: 'users.update', name: 'Update User', module: 'Users', description: 'Allows updating user account details' },
  { code: 'users.deactivate', name: 'Deactivate/Activate User', module: 'Users', description: 'Allows deactivating or reactivating user accounts' },
  { code: 'users.assign-roles', name: 'Assign User Roles', module: 'Users', description: 'Allows assigning roles to user accounts' },
  { code: 'users.delete', name: 'Delete User', module: 'Users', description: 'Allows hard deleting user accounts' },
  { code: 'users.manage', name: 'Manage Users / Admin Reset Password', module: 'Users', description: 'Allows administrative actions such as resetting user passwords' },

  // Roles Module
  { code: 'roles.view', name: 'View Roles', module: 'Roles', description: 'Allows viewing roles and role permissions' },
  { code: 'roles.create', name: 'Create Role', module: 'Roles', description: 'Allows creating new system or custom roles' },
  { code: 'roles.update', name: 'Update Role', module: 'Roles', description: 'Allows updating role name and description' },
  { code: 'roles.delete', name: 'Delete Role', module: 'Roles', description: 'Allows deleting non-system custom roles' },
  { code: 'roles.manage-permissions', name: 'Manage Role Permissions', module: 'Roles', description: 'Allows modifying permission assignments of roles' },

  // Permissions Module
  { code: 'permissions.view', name: 'View Permissions Catalog', module: 'Permissions', description: 'Allows viewing the full catalog of available system permissions' },

  // Company & Organization Module
  { code: 'company.view', name: 'View Company Profile', module: 'Organization', description: 'Allows viewing company profiles and legal details' },
  { code: 'company.manage', name: 'Manage Company Profile', module: 'Organization', description: 'Allows creating, editing, and uploading logo for companies' },
  { code: 'companies.view', name: 'View Companies', module: 'Organization', description: 'Allows viewing company profiles' },
  { code: 'companies.manage', name: 'Manage Companies', module: 'Organization', description: 'Allows managing company settings' },

  // Branches Module
  { code: 'branches.view', name: 'View Branches', module: 'Organization', description: 'Allows viewing organization branches' },
  { code: 'branches.manage', name: 'Manage Branches', module: 'Organization', description: 'Allows managing company branches' },

  // Departments Module
  { code: 'departments.view', name: 'View Departments', module: 'Organization', description: 'Allows viewing departments and org chart' },
  { code: 'departments.create', name: 'Create Department', module: 'Organization', description: 'Allows creating departments' },
  { code: 'departments.update', name: 'Update Department', module: 'Organization', description: 'Allows updating departments' },
  { code: 'departments.delete', name: 'Delete Department', module: 'Organization', description: 'Allows deleting departments' },
  { code: 'departments.manage', name: 'Manage Departments', module: 'Organization', description: 'Allows managing department hierarchy' },

  // Designations Module
  { code: 'designations.view', name: 'View Designations', module: 'Organization', description: 'Allows viewing job designations' },
  { code: 'designations.create', name: 'Create Designation', module: 'Organization', description: 'Allows creating job designations' },
  { code: 'designations.update', name: 'Update Designation', module: 'Organization', description: 'Allows updating job designations' },
  { code: 'designations.delete', name: 'Delete Designation', module: 'Organization', description: 'Allows deleting job designations' },
  { code: 'designations.manage', name: 'Manage Designations', module: 'Organization', description: 'Allows managing job designations' },

  // Employees Module
  { code: 'employees.view', name: 'View Employees', module: 'Employees', description: 'Allows viewing employee directory, 360 profiles, and history' },
  { code: 'employees.create', name: 'Create Employee', module: 'Employees', description: 'Allows onboarding new employees' },
  { code: 'employees.update', name: 'Update Employee', module: 'Employees', description: 'Allows editing employee records, bank details, and contacts' },
  { code: 'employees.delete', name: 'Terminate/Delete Employee', module: 'Employees', description: 'Allows terminating and removing employees' },
  { code: 'employees.terminate', name: 'Terminate Employment', module: 'Employees', description: 'Allows terminating employee contracts' },
  { code: 'employees.transfer', name: 'Transfer Employee', module: 'Employees', description: 'Allows departmental/branch transfers' },
  { code: 'employees.self', name: 'Self-Service Employee Profile', module: 'Employees', description: 'Allows employees to view and update their own profile' },

  // Shifts & Rosters Module
  { code: 'shifts.view', name: 'View Shifts', module: 'Attendance', description: 'Allows viewing shift configurations and monthly rosters' },
  { code: 'shifts.manage', name: 'Manage Shifts', module: 'Attendance', description: 'Allows creating, updating, assigning, and swapping shifts' },

  // Holidays Module
  { code: 'holidays.view', name: 'View Holidays', module: 'Attendance', description: 'Allows viewing company holiday calendar' },
  { code: 'holidays.manage', name: 'Manage Holidays', module: 'Attendance', description: 'Allows creating, updating, and importing holidays' },

  // Attendance Module
  { code: 'attendance.view', name: 'View Attendance', module: 'Attendance', description: 'Allows viewing employee attendance records, history, and live presence' },
  { code: 'attendance.manage', name: 'Manage Attendance', module: 'Attendance', description: 'Allows importing punches and configuring policies' },
  { code: 'attendance.approve', name: 'Approve Attendance Corrections', module: 'Attendance', description: 'Allows approving/rejecting punch regularizations' },
  { code: 'attendance.self', name: 'Self-Service Attendance', module: 'Attendance', description: 'Allows self-punch (GPS/Web/Selfie) and regularization requests' },

  // Leave Module
  { code: 'leave.view', name: 'View Leaves', module: 'Leave', description: 'Allows viewing leave requests, balances, and calendar' },
  { code: 'leave.manage', name: 'Manage Leaves', module: 'Leave', description: 'Allows configuring leave types and policies' },
  { code: 'leave.apply', name: 'Apply for Leave', module: 'Leave', description: 'Allows submitting and cancelling leave applications' },
  { code: 'leave.approve', name: 'Approve Leave Requests', module: 'Leave', description: 'Allows managers and HR to approve or reject leaves' },
  { code: 'leave.self', name: 'Self-Service Leave', module: 'Leave', description: 'Allows employees to manage own leaves' },

  // Salary Structure & Payheads Module
  { code: 'salary.view', name: 'View Salary Structures', module: 'Payroll', description: 'Allows viewing salary components and employee templates' },
  { code: 'salary.manage', name: 'Manage Salary Structures', module: 'Payroll', description: 'Allows creating payheads and assigning compensation structures' },

  // Loans & Advances Module
  { code: 'loans.view', name: 'View Loans', module: 'Loans', description: 'Allows viewing employee loan accounts and EMI schedules' },
  { code: 'loans.apply', name: 'Apply for Loan', module: 'Loans', description: 'Allows submitting salary advance/loan requests' },
  { code: 'loans.approve', name: 'Approve Loan Requests', module: 'Loans', description: 'Allows HR and Finance to approve and disburse loans' },

  // Expenses Module
  { code: 'expenses.view', name: 'View Expense Claims', module: 'Expenses', description: 'Allows viewing employee reimbursement claims' },
  { code: 'expenses.submit', name: 'Submit Expense Claim', module: 'Expenses', description: 'Allows submitting claims with receipt attachments' },
  { code: 'expenses.approve', name: 'Approve Expense Claims (Manager)', module: 'Expenses', description: 'Allows reporting managers to approve claims' },
  { code: 'expenses.finance', name: 'Finance Approve Expense Claims', module: 'Expenses', description: 'Allows finance to approve claims for reimbursement' },

  // Field Tracking Module
  { code: 'field.view', name: 'View Field Tracking', module: 'FieldTracking', description: 'Allows viewing live map locations and client visit logs' },
  { code: 'field.track', name: 'Track Field Visits', module: 'FieldTracking', description: 'Allows sending GPS pings and checking in/out of visits' },

  // Payroll Module
  { code: 'payroll.view', name: 'View Payroll', module: 'Payroll', description: 'Allows viewing payroll runs, breakdowns, and payslips' },
  { code: 'payroll.manage', name: 'Manage Payroll', module: 'Payroll', description: 'Allows initializing and updating payroll runs' },
  { code: 'payroll.create', name: 'Create Payroll Run', module: 'Payroll', description: 'Allows creating draft payroll runs' },
  { code: 'payroll.process', name: 'Process Payroll Run', module: 'Payroll', description: 'Allows calculating monthly earnings and deductions' },
  { code: 'payroll.approve', name: 'Approve Payroll Run', module: 'Payroll', description: 'Allows locking and finalizing payroll runs' },
  { code: 'payroll.disburse', name: 'Disburse Payroll', module: 'Payroll', description: 'Allows executing disbursement of approved payroll runs' },
  { code: 'payroll.export', name: 'Export Payroll Disbursement', module: 'Payroll', description: 'Allows exporting bank payment NEFT/RTGS files' },
  { code: 'payroll.self', name: 'Self-Service Payslips', module: 'Payroll', description: 'Allows employees to access their monthly payslips' },

  // Statutory & Compliance Module
  { code: 'compliance.view', name: 'View Statutory Compliance', module: 'Compliance', description: 'Allows viewing PF, ESIC, PT, and TDS computation summaries' },
  { code: 'compliance.manage', name: 'Manage Compliance Settings', module: 'Compliance', description: 'Allows configuring statutory tax rates and verifying declarations' },
  { code: 'compliance.export', name: 'Export Statutory Returns', module: 'Compliance', description: 'Allows exporting EPF ECR, ESIC returns, PT returns, and Form 16' },

  // Assets Module
  { code: 'assets.view', name: 'View Assets', module: 'Assets', description: 'Allows viewing company hardware and equipment inventory' },
  { code: 'assets.manage', name: 'Manage Assets', module: 'Assets', description: 'Allows registering, allocating, returning, and servicing assets' },

  // Tasks Module
  { code: 'tasks.view', name: 'View Tasks', module: 'Tasks', description: 'Allows viewing team tasks and personal assignments' },
  { code: 'tasks.create', name: 'Create Tasks', module: 'Tasks', description: 'Allows delegating and creating operational tasks' },
  { code: 'tasks.manage', name: 'Manage Tasks', module: 'Tasks', description: 'Allows managing task boards, updating statuses, and deleting tasks' },

  // Performance Module
  { code: 'performance.view', name: 'View Performance', module: 'Performance', description: 'Allows viewing appraisal cycles and team goals' },
  { code: 'performance.manage', name: 'Manage Performance', module: 'Performance', description: 'Allows initiating cycles, manager reviews, and finalizing ratings' },
  { code: 'performance.self', name: 'Self-Service Performance', module: 'Performance', description: 'Allows setting goals, self-reviews, and tracking progress' },

  // Training Module
  { code: 'training.view', name: 'View Training', module: 'Training', description: 'Allows viewing corporate training programs' },
  { code: 'training.manage', name: 'Manage Training', module: 'Training', description: 'Allows creating programs and enrolling employees' },

  // Helpdesk Module
  { code: 'helpdesk.view', name: 'View Support Tickets', module: 'Helpdesk', description: 'Allows viewing company helpdesk tickets and queues' },
  { code: 'helpdesk.create', name: 'Create Support Ticket', module: 'Helpdesk', description: 'Allows raising support tickets and adding comments' },
  { code: 'helpdesk.manage', name: 'Manage Helpdesk', module: 'Helpdesk', description: 'Allows assigning, prioritizing, and resolving tickets' },

  // Documents Module
  { code: 'documents.view', name: 'View Documents', module: 'Documents', description: 'Allows viewing and downloading organizational documents' },
  { code: 'documents.manage', name: 'Manage Documents', module: 'Documents', description: 'Allows uploading, verifying, and deleting documents' },

  // Policies Module
  { code: 'policies.view', name: 'View Policies', module: 'Policies', description: 'Allows viewing company policies and acknowledging them' },
  { code: 'policies.manage', name: 'Manage Policies', module: 'Policies', description: 'Allows drafting, publishing versions, and compliance audits' },

  // Recruitment & Pre-Boarding Module
  { code: 'recruitment.view', name: 'View Recruitment', module: 'Recruitment', description: 'Allows viewing job postings, applicants, and pipeline' },
  { code: 'recruitment.create', name: 'Create Job Postings', module: 'Recruitment', description: 'Allows creating job postings' },
  { code: 'recruitment.manage', name: 'Manage Recruitment', module: 'Recruitment', description: 'Allows managing applicants and extending offers' },
  { code: 'recruitment.offer', name: 'Issue Offer Letters', module: 'Recruitment', description: 'Allows creating and sending digital offer letters' },
  { code: 'recruitment.interview', name: 'Conduct Interview', module: 'Recruitment', description: 'Allows submitting interview feedback and ratings' },

  // Onboarding Module
  { code: 'onboarding.view', name: 'View Onboarding', module: 'Onboarding', description: 'Allows viewing onboarding progress and checklists' },
  { code: 'onboarding.manage', name: 'Manage Onboarding', module: 'Onboarding', description: 'Allows configuring joining checklists and verifying items' },

  // Reports & Analytics Module
  { code: 'reports.view', name: 'View Reports', module: 'Reports', description: 'Allows viewing organizational reports and analytics' },
  { code: 'reports.financial', name: 'View Financial Reports', module: 'Reports', description: 'Allows viewing payroll cost and financial trends' },
  { code: 'reports.export', name: 'Export Reports', module: 'Reports', description: 'Allows exporting custom Excel and CSV reports' },

  // Dashboard Module
  { code: 'dashboard.view', name: 'View Dashboard', module: 'Dashboard', description: 'Allows accessing executive dashboard metrics' },

  // System Settings Module
  { code: 'settings.view', name: 'View Settings', module: 'Settings', description: 'Allows viewing system configuration parameters' },
  { code: 'settings.manage', name: 'Manage Settings', module: 'Settings', description: 'Allows updating system configuration parameters' },

  // Audit Logs Module
  { code: 'audit.view', name: 'View Audit Logs', module: 'Audit', description: 'Allows inspecting system security audit trails' }
] as const;

/**
 * Union type of all valid system permission codes.
 */
export type SystemPermissionCode = typeof PERMISSION_CATALOG[number]['code'];
