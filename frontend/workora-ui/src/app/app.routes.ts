import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rbacGuard } from './core/guards/rbac.guard';

/**
 * Main application routing configuration enforcing lazy loading, layout nesting, and RBAC guards.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/features/landing/pages/landing-page.component').then(m => m.LandingPageComponent),
    pathMatch: 'full'
  },
  {
    path: 'landing',
    loadComponent: () => import('./presentation/features/landing/pages/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./presentation/features/auth/pages/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./presentation/features/auth/pages/forgot-password-page.component').then(m => m.ForgotPasswordPageComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./presentation/features/auth/pages/reset-password-page.component').then(m => m.ResetPasswordPageComponent)
  },
  {
    path: '',
    loadComponent: () => import('./presentation/layouts/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canMatch: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./presentation/features/dashboard/pages/dashboard-page.component').then(m => m.DashboardPageComponent)
      },
      {
        path: 'organization',
        loadComponent: () => import('./presentation/features/organization/pages/organization-page.component').then(m => m.OrganizationPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'company.view' }
      },
      {
        path: 'roles',
        loadComponent: () => import('./presentation/features/roles/pages/role-list-page.component').then(m => m.RoleListPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'roles.view' }
      },
      {
        path: 'employees',
        loadComponent: () => import('./presentation/features/employees/pages/employee-list-page.component').then(m => m.EmployeeListPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'employees.view' }
      },
      {
        path: 'attendance',
        loadComponent: () => import('./presentation/features/attendance/pages/attendance-page.component').then(m => m.AttendancePageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'attendance.self' }
      },
      {
        path: 'leave',
        loadComponent: () => import('./presentation/features/leave/pages/leave-page.component').then(m => m.LeavePageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'leave.view' }
      },
      {
        path: 'holidays',
        loadComponent: () => import('./presentation/features/scheduling/pages/holidays-page.component').then(m => m.HolidaysPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'holidays.view' }
      },
      {
        path: 'shifts',
        loadComponent: () => import('./presentation/features/scheduling/pages/shifts-page.component').then(m => m.ShiftsPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'shifts.view' }
      },
      {
        path: 'payroll',
        loadComponent: () => import('./presentation/features/payroll/pages/payroll-page.component').then(m => m.PayrollPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'payroll.manage' }
      },
      {
        path: 'my-payslips',
        loadComponent: () => import('./presentation/features/payroll/pages/payslips-page.component').then(m => m.PayslipsPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'payroll.self' }
      },
      {
        path: 'loans',
        loadComponent: () => import('./presentation/features/financials/pages/loans-page.component').then(m => m.LoansPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'loans.view' }
      },
      {
        path: 'expenses',
        loadComponent: () => import('./presentation/features/financials/pages/expenses-page.component').then(m => m.ExpensesPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'expenses.view' }
      },
      {
        path: 'jobs',
        loadComponent: () => import('./presentation/features/recruitment/pages/jobs-page.component').then(m => m.JobsPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'recruitment.view' }
      },
      {
        path: 'candidates',
        loadComponent: () => import('./presentation/features/recruitment/pages/candidates-page.component').then(m => m.CandidatesPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'recruitment.view' }
      },
      {
        path: 'performance',
        loadComponent: () => import('./presentation/features/performance/pages/performance-page.component').then(m => m.PerformancePageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'performance.view' }
      },
      {
        path: 'training',
        loadComponent: () => import('./presentation/features/learning/pages/training-page.component').then(m => m.TrainingPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'training.view' }
      },
      {
        path: 'helpdesk',
        loadComponent: () => import('./presentation/features/helpdesk/pages/helpdesk-page.component').then(m => m.HelpdeskPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'helpdesk.view' }
      },
      {
        path: 'tasks',
        loadComponent: () => import('./presentation/features/tasks/pages/tasks-page.component').then(m => m.TasksPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'tasks.view' }
      },
      {
        path: 'compliance',
        loadComponent: () => import('./presentation/features/compliance/pages/compliance-page.component').then(m => m.CompliancePageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'compliance.view' }
      },
      {
        path: 'field-tracking',
        loadComponent: () => import('./presentation/features/field/pages/field-tracking-page.component').then(m => m.FieldTrackingPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'field.view' }
      },
      {
        path: 'reports',
        loadComponent: () => import('./presentation/features/reports/pages/reports-page.component').then(m => m.ReportsPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'reports.view' }
      },
      {
        path: 'superadmin',
        loadComponent: () => import('./presentation/features/superadmin/pages/superadmin-page.component').then(m => m.SuperAdminPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'superadmin.access' }
      },
      {
        path: 'documents',
        loadComponent: () => import('./presentation/features/operations/pages/documents-page.component').then(m => m.DocumentsPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'documents.view' }
      },
      {
        path: 'assets',
        loadComponent: () => import('./presentation/features/operations/pages/assets-page.component').then(m => m.AssetsPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'assets.view' }
      },
      {
        path: 'settings',
        loadComponent: () => import('./presentation/features/settings/pages/settings-page.component').then(m => m.SettingsPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'settings.view' }
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('./presentation/features/settings/pages/audit-logs-page.component').then(m => m.AuditLogsPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'audit.view' }
      },
      {
        path: 'users',
        loadComponent: () => import('./presentation/features/users/pages/user-list-page.component').then(m => m.UserListPageComponent),
        canMatch: [rbacGuard],
        data: { requiredPermission: 'users.view' }
      },
      {
        path: 'change-password',
        loadComponent: () => import('./presentation/features/auth/pages/change-password-page.component').then(m => m.ChangePasswordPageComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
