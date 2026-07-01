# User Stories & Personas

Workora uses a strict Role-Based Access Control (RBAC) model. Below are the primary personas and their core user stories.

## Personas

1. **Super Admin**: Platform operator managing the SaaS infrastructure. Operates outside of tenant isolation.
2. **Company Admin**: Highest authority within a single Tenant organization.
3. **HR Manager**: Manages employee lifecycles, recruitment, and organizational structure within a tenant.
4. **Finance**: Manages payroll, expenses, and statutory compliance within a tenant.
5. **Reporting Manager**: Middle management; accesses data for direct/indirect reports only.
6. **Employee**: Self-service user. Can only view and mutate their own data.

---

## User Stories

### Super Admin
- As a Super Admin, I want to onboard new tenant organizations, so they can start using the platform.
- As a Super Admin, I want to suspend a tenant's subscription, locking them into a read-only state without deleting their data.
- As a Super Admin, I want to manage feature toggles based on tenant pricing plans.

### Company Admin
- As a Company Admin, I want to configure the RBAC permission matrix for custom roles in my organization.
- As a Company Admin, I want to define branch locations, departments, and holiday calendars.
- As a Company Admin, I want to enforce MFA policies globally across my tenant.

### HR Manager
- As an HR Manager, I want to add new employees and define their salary structures, shifts, and reporting managers.
- As an HR Manager, I want to view the attendance anomaly report to correct punches for employees who forgot to check out.
- As an HR Manager, I want to process offboarding workflows to revoke access and trigger full-and-final settlements.

### Finance / Payroll Admin
- As a Finance user, I want to generate a monthly payroll batch run so that salaries are calculated automatically based on attendance and leave data.
- As a Finance user, I want to lock a verified payroll run so that the data becomes immutable and cannot be tampered with.
- As a Finance user, I want to generate a bank transfer file in the ICICI/HDFC corporate format to disburse salaries in bulk.

### Reporting Manager
- As a Reporting Manager, I want to receive notifications when my direct reports apply for leave, so I can approve or reject them.
- As a Reporting Manager, I want to view the attendance summary of my team to monitor punctuality.
- As a Reporting Manager, I want to submit performance appraisal reviews for my team members.

### Employee
- As an Employee, I want to check-in and check-out via the web portal or biometric device to log my daily hours.
- As an Employee, I want to view my available leave balances and apply for time off.
- As an Employee, I want to download my monthly PDF payslips.
- As an Employee, I want to upload expense receipts for reimbursement.
