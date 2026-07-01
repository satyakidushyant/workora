# Business Rules & Domain Logic

This document defines specific rules that must be enforced within the Domain and Application layers of the Workora platform.

## 1. Tenant Isolation
- **Rule:** A user belonging to `Tenant A` can never access, read, update, or delete records belonging to `Tenant B`.
- **Enforcement:** Enforced globally via EF Core `HasQueryFilter(e => e.TenantId == _tenantContext.TenantId)`. This applies to every table except platform-level administration tables.

## 2. Payroll Immutability
- **Rule:** Once a payroll run is transitioned to the `Locked` state, it cannot be modified or deleted by any user, including Company Admins.
- **Enforcement:** The `PayrollRun` entity throws a `DomainException` if a modification is attempted on a locked run.
- **Correction Protocol:** Any corrections required after a lock must be handled via a distinct **Adjustment Run** linked to the original run.

## 3. Separation of Duties (SoD) in Payroll
- **Rule:** The user who generated the payroll run (`GeneratedBy`) cannot be the same user who locks the payroll run (`LockedBy`).
- **Enforcement:** Handled in the `LockPayrollCommand` validation pipeline.

## 4. Leave Balance Validation
- **Rule:** A leave request cannot be submitted if it drives the employee's balance for that leave type below zero.
- **Exception:** Leave types configured with `AllowNegativeBalance = true` (e.g., Loss of Pay / LOP).
- **Enforcement:** `CreateLeaveRequestCommand` performs a balance check inside a serializable transaction block before inserting the request.

## 5. Attendance & Leave Interoperability
- **Rule:** If an employee has an `Approved` leave request for a specific date, the Attendance engine must automatically mark that date's attendance status as `On Leave` during the nightly reconciliation job.
- **Enforcement:** Triggered via the `LeaveApprovedEvent` domain event.

## 6. Audit Immutability
- **Rule:** Records in the `AuditLogs` table are append-only. They cannot be updated or deleted via the application API.
- **Enforcement:** The application lacks any EF Core configurations or repository methods to update or delete `AuditLog` entities.

## 7. Soft Deletion
- **Rule:** Critical business records (Employees, Departments, Salary Structures) are never hard-deleted from the database.
- **Enforcement:** Deleting a record sets `IsDeleted = true`, `DeletedBy = userId`, and `DeletedDate = utcNow`. A global query filter hides these records from standard queries.
