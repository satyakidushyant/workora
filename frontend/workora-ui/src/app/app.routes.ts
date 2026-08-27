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
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./presentation/features/dashboard/pages/dashboard-page.component').then(m => m.DashboardPageComponent)
      },
      {
        path: 'organization',
        loadComponent: () => import('./presentation/features/organization/pages/organization-page.component').then(m => m.OrganizationPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['company.view', 'companies.view', 'branches.view', 'departments.view', 'designations.view'] }
      },
      {
        path: 'roles',
        loadComponent: () => import('./presentation/features/roles/pages/role-list-page.component').then(m => m.RoleListPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['roles.view'] }
      },
      {
        path: 'employees',
        loadComponent: () => import('./presentation/features/employees/pages/employee-list-page.component').then(m => m.EmployeeListPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['employees.view', 'employees.self'] }
      },
      {
        path: 'attendance',
        loadComponent: () => import('./presentation/features/attendance/pages/attendance-page.component').then(m => m.AttendancePageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['attendance.self', 'attendance.view', 'attendance.manage', 'attendance.approve'] }
      },
      {
        path: 'leave',
        loadComponent: () => import('./presentation/features/leave/pages/leave-page.component').then(m => m.LeavePageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['leave.view', 'leave.self', 'leave.apply', 'leave.approve'] }
      },
      {
        path: 'holidays',
        loadComponent: () => import('./presentation/features/scheduling/pages/holidays-page.component').then(m => m.HolidaysPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['holidays.view', 'holidays.manage'] }
      },
      {
        path: 'shifts',
        loadComponent: () => import('./presentation/features/scheduling/pages/shifts-page.component').then(m => m.ShiftsPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['shifts.view', 'shifts.manage'] }
      },
      {
        path: 'payroll',
        loadComponent: () => import('./presentation/features/payroll/pages/payroll-page.component').then(m => m.PayrollPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['payroll.manage', 'payroll.process', 'payroll.view', 'payroll.create'] }
      },
      {
        path: 'my-payslips',
        loadComponent: () => import('./presentation/features/payroll/pages/payslips-page.component').then(m => m.PayslipsPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['payroll.self'] }
      },
      {
        path: 'loans',
        loadComponent: () => import('./presentation/features/financials/pages/loans-page.component').then(m => m.LoansPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['loans.view', 'loans.apply', 'loans.approve'] }
      },
      {
        path: 'expenses',
        loadComponent: () => import('./presentation/features/financials/pages/expenses-page.component').then(m => m.ExpensesPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['expenses.view', 'expenses.submit', 'expenses.approve', 'expenses.finance'] }
      },
      {
        path: 'jobs',
        loadComponent: () => import('./presentation/features/recruitment/pages/jobs-page.component').then(m => m.JobsPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['recruitment.view', 'recruitment.manage', 'recruitment.create'] }
      },
      {
        path: 'candidates',
        loadComponent: () => import('./presentation/features/recruitment/pages/candidates-page.component').then(m => m.CandidatesPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['recruitment.view', 'recruitment.manage'] }
      },
      {
        path: 'performance',
        loadComponent: () => import('./presentation/features/performance/pages/performance-page.component').then(m => m.PerformancePageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['performance.view', 'performance.self', 'performance.manage'] }
      },
      {
        path: 'training',
        loadComponent: () => import('./presentation/features/learning/pages/training-page.component').then(m => m.TrainingPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['training.view', 'training.manage'] }
      },
      {
        path: 'helpdesk',
        loadComponent: () => import('./presentation/features/helpdesk/pages/helpdesk-page.component').then(m => m.HelpdeskPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['helpdesk.view', 'helpdesk.create', 'helpdesk.manage'] }
      },
      {
        path: 'tasks',
        loadComponent: () => import('./presentation/features/tasks/pages/tasks-page.component').then(m => m.TasksPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['tasks.view', 'tasks.create', 'tasks.manage'] }
      },
      {
        path: 'compliance',
        loadComponent: () => import('./presentation/features/compliance/pages/compliance-page.component').then(m => m.CompliancePageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['compliance.view', 'compliance.manage', 'compliance.export'] }
      },
      {
        path: 'field-tracking',
        loadComponent: () => import('./presentation/features/field/pages/field-tracking-page.component').then(m => m.FieldTrackingPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['field.view', 'field.track'] }
      },
      {
        path: 'reports',
        loadComponent: () => import('./presentation/features/reports/pages/reports-page.component').then(m => m.ReportsPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['reports.view', 'reports.financial', 'reports.export'] }
      },
      {
        path: 'superadmin',
        loadComponent: () => import('./presentation/features/superadmin/pages/superadmin-page.component').then(m => m.SuperAdminPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['superadmin.access'] }
      },
      {
        path: 'documents',
        loadComponent: () => import('./presentation/features/operations/pages/documents-page.component').then(m => m.DocumentsPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['documents.view', 'documents.manage', 'policies.view'] }
      },
      {
        path: 'assets',
        loadComponent: () => import('./presentation/features/operations/pages/assets-page.component').then(m => m.AssetsPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['assets.view', 'assets.manage'] }
      },
      {
        path: 'settings',
        loadComponent: () => import('./presentation/features/settings/pages/settings-page.component').then(m => m.SettingsPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['settings.view', 'settings.manage'] }
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('./presentation/features/settings/pages/audit-logs-page.component').then(m => m.AuditLogsPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['audit.view'] }
      },
      {
        path: 'users',
        loadComponent: () => import('./presentation/features/users/pages/user-list-page.component').then(m => m.UserListPageComponent),
        canActivate: [rbacGuard],
        data: { requiredPermissions: ['users.view', 'users.manage'] }
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
