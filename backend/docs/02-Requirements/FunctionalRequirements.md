# Functional Requirements (FR)

This document outlines the core functional requirements for the Workora platform, grouped by module.

## FR-AUTH: Authentication & Identity
- **FR-AUTH-1**: Authenticate via email + password; short-lived JWT access token (15 min) + rotating refresh token (7 days, sliding).
- **FR-AUTH-2**: Optional TOTP-based MFA per user, enforceable per role by Company Admin policy.
- **FR-AUTH-3**: Lock account 15 minutes after 5 consecutive failed logins; log as security event.
- **FR-AUTH-4**: Forgot-password issues single-use, time-boxed (30 min) reset token via email.
- **FR-AUTH-5**: Tokens are tenant-scoped: a JWT for Tenant A must be rejected on Tenant B resources, enforced at middleware.
- **FR-AUTH-6**: Refresh tokens are single-use, rotated on every refresh; reuse of a revoked token revokes the entire token family.

## FR-ORG: Organization Management
- **FR-ORG-1**: Company Admin defines Branches, Departments, Designations, Cost Centers, Shifts, Holiday Calendars, scoped to tenant.
- **FR-ORG-2**: Departments/Designations support hierarchical (parent/child) structures.
- **FR-ORG-3**: Shifts support fixed, rotational, flexible types with grace-period and overtime threshold parameters.

## FR-EMP: Employee Management
- **FR-EMP-1**: Versioned employee profile (personal, contact, address, emergency contact, family, education, experience, skills, bank, identity documents).
- **FR-EMP-2**: Sensitive identity fields (Aadhaar, PAN, bank account) encrypted at rest, masked in API responses unless `Employee.ViewSensitive` is held.
- **FR-EMP-3**: Employment lifecycle events (Joining, Confirmation, Promotion, Transfer, Exit) as an immutable, timestamped event log.
- **FR-EMP-4**: Exit triggers configurable offboarding workflow.

## FR-ATT: Attendance
- **FR-ATT-1**: Check-In/Check-Out with timestamp, source (web/mobile/biometric), geo-coordinates.
- **FR-ATT-2**: Daily attendance status (Present, Absent, Half Day, Late, Early Exit, On Leave, Holiday, Week Off) via rules engine.
- **FR-ATT-3**: Manual correction requires a reason code and approval workflow; original punches retained.
- **FR-ATT-4**: Overtime auto-computed when check-out exceeds shift end + configurable threshold.
- **FR-ATT-5**: Biometric integration via idempotent internal ingestion API.

## FR-LVE: Leave Management
- **FR-LVE-1**: Configurable leave types per tenant (Casual, Sick, Earned, Maternity, LOP).
- **FR-LVE-2**: Leave balance via accrual engine.
- **FR-LVE-3**: Multi-level approval workflow (default: Reporting Manager → HR).
- **FR-LVE-4**: Approved leave automatically reflects in Attendance.
- **FR-LVE-5**: Prevent submission driving balance negative unless leave type allows it (e.g., LOP).

## FR-PAY: Payroll
- **FR-PAY-1**: Configurable salary structures (Basic, HRA, Allowances, Deductions).
- **FR-PAY-2**: Payroll generation as a batch process producing a run per tenant per cycle.
- **FR-PAY-3**: Locked runs are immutable; corrections require a linked adjustment run.
- **FR-PAY-4**: Statutory deductions (PF, ESI, PT, TDS) versioned.
- **FR-PAY-5**: Bank transfer file generation per supported formats; PDF payslips.

## FR-ADM: Settings & Platform Administration
- **FR-ADM-1**: Roles/Permissions managed via a permission-matrix UI backed by RBAC engine.
- **FR-ADM-2**: Super Admin manages tenant subscriptions, plan-based feature toggles, billing status.
- **FR-ADM-3**: All configuration changes captured in audit log with before/after values.
