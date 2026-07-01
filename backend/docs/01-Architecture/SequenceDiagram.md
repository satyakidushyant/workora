# Sequence Diagrams

This document illustrates the execution flow of the most critical processes in the Workora platform.

## 1. Login with MFA & Token Issuance

```mermaid
sequenceDiagram
    actor U as User
    participant API as Workora.API
    participant AUTH as IIdentityService
    participant DB as PostgreSQL
    participant CACHE as Redis

    U->>API: POST /auth/login {email, password}
    API->>DB: Lookup user by (tenant, email)
    DB-->>API: user record + password_hash
    API->>AUTH: Verify password hash
    alt invalid credentials
        AUTH-->>API: mismatch
        API->>DB: Increment failed_attempts
        API-->>U: 401 Unauthorized
    else valid, 5th consecutive failure reached
        API->>DB: Lock account 15 min, log security event
        API-->>U: 423 Locked
    else valid credentials, MFA enabled
        API-->>U: 200 { mfaRequired: true, preAuthToken }
        U->>API: POST /auth/mfa/verify {preAuthToken, totpCode}
        API->>AUTH: Validate TOTP against mfa_secret
        AUTH-->>API: valid
        API->>AUTH: Issue JWT access token (15m) + refresh token (7d)
        API->>DB: Store hashed refresh token + family_id
        API->>CACHE: Cache denormalized permissions (optional)
        API-->>U: 200 { accessToken, refreshToken }
    else valid credentials, no MFA
        API->>AUTH: Issue JWT access token (15m) + refresh token (7d)
        API->>DB: Store hashed refresh token + family_id
        API-->>U: 200 { accessToken, refreshToken }
    end
```

## 2. Tenant Isolation Enforcement (Defense-in-Depth)

```mermaid
sequenceDiagram
    actor U as User (Tenant A JWT)
    participant MW as Auth Middleware
    participant CTX as ITenantContext
    participant H as Command/Query Handler
    participant EF as EF Core (Global Query Filter)
    participant DB as PostgreSQL

    U->>MW: Request with Bearer JWT (tenant_id=A)
    MW->>CTX: Resolve TenantId from JWT claims
    CTX-->>MW: TenantId = A
    MW->>H: Forward request (TenantId in scoped context)
    Note over H: TenantAuthorizationBehavior checks<br/>request-level tenant consistency
    H->>EF: Query e.g. GetEmployeeById(id from Tenant B)
    EF->>EF: Apply global filter WHERE tenant_id = 'A'
    EF->>DB: SELECT ... WHERE tenant_id = 'A' AND id = :id
    DB-->>EF: No rows (Tenant B record filtered out)
    EF-->>H: null
    H-->>U: 404 Not Found (not 403 - avoids confirming existence)
```

## 3. Leave Request Approval Workflow

```mermaid
sequenceDiagram
    actor E as Employee
    participant API as Workora.API
    participant H as LeaveRequestHandler
    participant DB as PostgreSQL
    actor M as Reporting Manager
    actor HR as HR Manager
    participant ATT as Attendance Module
    participant NOTIF as Notification Queue

    E->>API: POST /leave-requests {leaveTypeId, startDate, endDate}
    API->>H: CreateLeaveRequestCommand
    H->>DB: Check leave_balances for employee/type/year
    alt would drive balance negative and type disallows it
        H-->>API: Business rule violation
        API-->>E: 422 Unprocessable Entity
    else balance sufficient (or type allows negative, e.g. LOP)
        H->>DB: Insert leave_requests (status=pending, approver=Manager)
        H->>NOTIF: Queue notification to Manager
        API-->>E: 201 Created
        M->>API: PUT /leave-requests/{id}/approve
        API->>DB: Update approver -> HR, status remains pending
        API->>NOTIF: Queue notification to HR
        HR->>API: PUT /leave-requests/{id}/approve
        API->>DB: Update status=approved
        API->>ATT: Reflect approved dates into attendance (status=on_leave)
        API->>DB: Deduct leave_balances
        API->>NOTIF: Queue notification to Employee
        API-->>HR: 200 OK
    end
```

## 4. Payroll Run Generation & Locking

```mermaid
sequenceDiagram
    actor F as Finance User
    participant API as Workora.API
    participant Q as Hangfire Queue
    participant JOB as Payroll Batch Job
    participant STAT as StatutoryRuleProvider
    participant DB as PostgreSQL
    participant FILES as File Storage

    F->>API: POST /payroll-runs {cycleMonth, cycleYear}
    API->>DB: Create payroll_runs (status=draft)
    API->>Q: Enqueue PayrollGenerationJob(runId)
    API-->>F: 202 Accepted {runId}

    Q->>JOB: Dequeue job
    loop for each active employee
        JOB->>DB: Pull attendance, leave (LOP), salary_structures as of lock date
        JOB->>STAT: Get PF/ESI/PT/TDS/Gratuity rules effective for cycle
        JOB->>JOB: Compute gross/net pay (decimal arithmetic)
        JOB->>DB: Insert/Upsert payslip (run_id, employee_id) unique constraint
        JOB->>FILES: Generate payslip PDF, store (Cloudinary), link pdf_file_id
    end
    JOB->>DB: Update payroll_runs status=generated
    JOB->>API: Notify Finance run is ready

    F->>API: PUT /payroll-runs/{id}/lock
    API->>DB: Verify locker != generator (SoD)
    API->>DB: Update status=locked, locked_at, locked_by
    Note over DB: Run now immutable.<br/>Corrections require a new linked adjustment run.
    F->>API: GET /payroll-runs/{id}/bank-file
    API->>DB: Read locked payslips
    API-->>F: Bank transfer file (per bank format)
```
