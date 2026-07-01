# Database Design & Architecture

Workora utilizes **PostgreSQL 16+** as its primary relational database store, managed via Entity Framework (EF) Core 9.

## Multi-Tenancy Strategy
The database implements a **Shared-Database, Shared-Schema** multi-tenancy model. 
- All tenant data co-exists within the same tables.
- Isolation is achieved via a mandatory `TenantId` (UUID) column on every tenant-scoped table.
- At the EF Core level, a **Global Query Filter** automatically appends `WHERE TenantId = @currentTenantId` to all LINQ queries, preventing cross-tenant data leakage.

## Primary Keys
- **Surrogate Keys**: All primary keys are `UUID` (GUIDs in C#).
- **Generation**: Generated on the client/application side using `Guid.NewGuid()`, or database-side using `gen_random_uuid()` as the default value. This prevents sequential-ID enumeration attacks and simplifies distributed data insertion.

## Audit Columns
Every entity inherits from `AuditableEntity` and generates the following columns in the database:
- `CreatedBy` (UUID)
- `CreatedDate` (Timestamp with Timezone)
- `UpdatedBy` (UUID, nullable)
- `UpdatedDate` (Timestamp with Timezone, nullable)
- `DeletedBy` (UUID, nullable)
- `DeletedDate` (Timestamp with Timezone, nullable)
- `IsDeleted` (Boolean)

## Table Categories

### 1. Platform & Tenancy (Cross-Tenant)
These tables manage the SaaS infrastructure and do *not* contain a `TenantId`.
- `Companies`: The root tenant record.
- `SubscriptionPlans`: Pricing plans and feature limits.
- `SuperAdmins`: Platform-level operators.

### 2. Tenant Data (Isolated)
These tables carry the `TenantId` column and foreign key back to the `Companies` table.
- `Employees`, `Departments`, `Designations`, `Shifts`
- `LeaveRequests`, `LeaveBalances`
- `AttendancePunches`, `AttendanceDaily`
- `PayrollRuns`, `Payslips`, `SalaryStructures`
- `Roles`, `Permissions`, `Users`

### 3. Append-Only Stores
- `AuditLogs`: Records JSON snapshots (before/after states) for every mutating operation on business entities. Append-only, never updated or deleted.

## Data Types (PostgreSQL)
- **Monetary values**: `numeric(18,2)` mapped to C# `decimal`.
- **Strings**: `varchar` with defined maximum lengths.
- **JSON**: `jsonb` used for dynamic audit payloads and external webhook payloads.
- **Dates**: `date` for birth dates/joining dates. `timestamptz` for accurate auditing points.
