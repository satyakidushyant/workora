# Workora — Complete Frontend & Backend Logic Flow

## 360° Human Resource Management & Payroll Platform

---

## Table of Contents

1. [System Overview & User Types](#1-system-overview--user-types)
2. [Login & Authentication Flow](#2-login--authentication-flow)
3. [Dashboard Logic by User Type](#3-dashboard-logic-by-user-type)
4. [Organization Module Logic](#4-organization-module-logic)
5. [Employee Management Module Logic](#5-employee-management-module-logic)
6. [Attendance Module Logic](#6-attendance-module-logic)
7. [Leave Management Module Logic](#7-leave-management-module-logic)
8. [Payroll Module Logic](#8-payroll-module-logic)
9. [Expense Management Module Logic](#9-expense-management-module-logic)
10. [Loan Management Module Logic](#10-loan-management-module-logic)
11. [Asset Management Module Logic](#11-asset-management-module-logic)
12. [Performance Management Module Logic](#12-performance-management-module-logic)
13. [Task Management Module Logic](#13-task-management-module-logic)
14. [Helpdesk Module Logic](#14-helpdesk-module-logic)
15. [Document Management Module Logic](#15-document-management-module-logic)
16. [Compliance Module Logic](#16-compliance-module-logic)
17. [Reporting Module Logic](#17-reporting-module-logic)
18. [Cross-Cutting Workflows](#18-cross-cutting-workflows)

---

## 1. System Overview & User Types

### 1.1 Three User Tiers

```
┌─────────────────────────────────────────────────────────────────┐
│                     WORKORA PLATFORM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              LEVEL 1: SUPER ADMIN                        │   │
│  │  - Platform Owner/Operator                               │   │
│  │  - Manages all tenants                                   │   │
│  │  - Controls subscriptions & plans                        │   │
│  │  - Platform-wide analytics & audit                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         LEVEL 2: COMPANY ADMIN / HR / FINANCE / MANAGER │   │
│  │  - Tenant-side administrators                           │   │
│  │  - Manage own company only                              │   │
│  │  - Approve workflows                                    │   │
│  │  - Run payroll                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           LEVEL 3: EMPLOYEE (ESS)                       │   │
│  │  - Self-service portal                                  │   │
│  │  - Punch attendance                                     │   │
│  │  - Apply leave                                          │   │
│  │  - View payslips                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 User Role Hierarchy & Permissions Mapping

| Role | Can View | Can Create/Edit | Can Approve | Can Delete |
|---|---|---|---|---|
| **Super Admin** | All tenants, platform data | Tenants, Plans, Platform Users | N/A | Tenants |
| **Company Admin** | All company data | Branches, Departments, Designations | All workflows | Employees (with approval) |
| **HR Admin** | All employees, attendance, leave | Employees, Policies, Holidays | Leave, Attendance | Employee records |
| **Finance** | Payroll, Expenses, Loans | Payheads, Salary Structures | Payroll, Expenses, Loans | Financial records |
| **Manager** | Team members only | Team tasks | Team leave, attendance | Team records |
| **Employee** | Self data only | Self leave, expenses | N/A | N/A |

---

## 2. Login & Authentication Flow

### 2.1 Complete Login Process

```
┌─────────────────────────────────────────────────────────────────┐
│                      LOGIN FLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. USER ENTERS CREDENTIALS                                     │
│     ┌──────────────────────────────────────────────┐           │
│     │  Email: employee@company.com                  │           │
│     │  Password: ********                          │           │
│     │  [LOGIN]                                    │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  2. BACKEND AUTHENTICATION                                     │
│     ┌──────────────────────────────────────────────┐           │
│     │  Check user exists                           │           │
│     │  Verify BCrypt password hash                 │           │
│     │  Check account lockout status                │           │
│     │  Validate tenant membership                  │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  3. BACKEND DETERMINES USER TYPE                               │
│     ┌──────────────────────────────────────────────┐           │
│     │  Query user roles & permissions from DB      │           │
│     │  Check if user is Platform User              │           │
│     │  Check if user is Tenant User                │           │
│     │  Get employee mapping if exists              │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  4. BACKEND RETURNS SESSION DATA                               │
│     ┌──────────────────────────────────────────────┐           │
│     │  {                                           │           │
│     │    "accessToken": "jwt...",                  │           │
│     │    "refreshToken": "refresh...",             │           │
│     │    "user": {                                 │           │
│     │      "id": "user-123",                       │           │
│     │      "type": "TENANT_USER",                  │           │
│     │      "email": "employee@company.com"         │           │
│     │    },                                        │           │
│     │    "tenant": {                               │           │
│     │      "id": "tenant-123",                     │           │
│     │      "name": "ABC Technologies"              │           │
│     │    },                                        │           │
│     │    "roles": ["HR_ADMIN"],                    │           │
│     │    "permissions": ["employee.view", ...]     │           │
│     │  }                                           │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  5. FRONTEND ROUTES BASED ON USER TYPE                         │
│     ┌──────────────────────────────────────────────┐           │
│     │  Platform User → /platform/dashboard          │           │
│     │  Tenant Admin → /app/dashboard                │           │
│     │  HR/Manager → /app/dashboard                  │           │
│     │  Employee → /employee/home                    │           │
│     └──────────────────────────────────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOKEN REFRESH FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. ACCESS TOKEN EXPIRES (15 minutes)                          │
│     ┌──────────────────────────────────────────────┐           │
│     │  API returns 401 Unauthorized                 │           │
│     │  Frontend interceptor catches                 │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  2. FRONTEND CALLS REFRESH ENDPOINT                            │
│     ┌──────────────────────────────────────────────┐           │
│     │  POST /api/v1/auth/refresh-token             │           │
│     │  Body: { refreshToken: "..." }               │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  3. BACKEND VALIDATES REFRESH TOKEN                            │
│     ┌──────────────────────────────────────────────┐           │
│     │  Check SHA-256 hash matches stored token      │           │
│     │  Verify token not revoked                     │           │
│     │  Check expiry date                            │           │
│     │  Verify device fingerprint                    │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  4. BACKEND ISSUES NEW TOKENS                                  │
│     ┌──────────────────────────────────────────────┐           │
│     │  Generate new access token                   │           │
│     │  Generate new refresh token                  │           │
│     │  Invalidate old refresh token                │           │
│     │  Store new refresh token hash                │           │
│     │  Return new tokens to frontend               │           │
│     └──────────────────────────────────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Dashboard Logic by User Type

### 3.1 Super Admin Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                  SUPER ADMIN DASHBOARD                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  TOP KPIs                                               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │   │
│  │  │ Tenants  │  │  Active  │  │   MRR    │  │  Users  │ │   │
│  │  │   156    │  │   142    │  │ $45,230  │  │ 3,847   │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  RECENT TENANT REGISTRATIONS                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ TechCorp Inc    │ Enterprise │ 2026-08-25 │ Active │ │   │
│  │  │ GreenLeaf Ltd   │ Starter   │ 2026-08-24 │ Trial  │ │   │
│  │  │ BlueWave Co     │ Pro       │ 2026-08-23 │ Active │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  SYSTEM HEALTH                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │ API      │  │ Database │  │ Storage  │              │   │
│  │  │ 99.98%   │  │ 99.99%   │  │ 87% Used │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  SUBSCRIPTION DISTRIBUTION                             │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  Starter: 45%  ████████████████████                │ │   │
│  │  │  Pro: 35%     ████████████████                     │ │   │
│  │  │  Enterprise: 20% ██████████                        │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Super Admin Actions:**
- Click "Tenants" → View all organizations → Manage tenant status
- Click "Create Tenant" → Onboard new organization
- Click "Plans" → Manage subscription tiers
- Click "Tenant Name" → Switch context to view tenant data

### 3.2 Company Admin Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                COMPANY ADMIN DASHBOARD                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  TOP KPIs                                               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │   │
│  │  │ Employees│  │ Present  │  │  On      │  │  Pending│ │   │
│  │  │   342    │  │   289    │  │  Leave   │  │ Approvals│ │   │
│  │  │          │  │          │  │   23     │  │   12    │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ATTENDANCE SUMMARY                                      │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  Present: 84%   ████████████████████               │ │   │
│  │  │  Absent: 8%     ████                               │ │   │
│  │  │  Leave: 7%      ███                                │ │   │
│  │  │  Late: 1%       █                                  │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PENDING APPROVALS                                      │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ • Leave Requests   │ 8 pending │ [View] [Approve]   │ │   │
│  │  │ • Expense Claims   │ 3 pending │ [View] [Approve]   │ │   │
│  │  │ • Loan Requests    │ 1 pending │ [View] [Approve]   │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PAYROLL STATUS                                         │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  August 2026                                       │ │   │
│  │  │  Status: In Progress                               │ │   │
│  │  │  Total Employees: 342                              │ │   │
│  │  │  Processed: 280/342                                │ │   │
│  │  │  [Continue] [View Details]                         │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Company Admin Actions:**
- Click "Employees" → Manage employee records
- Click "Attendance" → View/modify attendance
- Click "Payroll" → Process monthly payroll
- Click Pending Approval → Review and approve requests
- Click "Settings" → Configure company policies

### 3.3 Employee Dashboard (ESS)

```
┌─────────────────────────────────────────────────────────────────┐
│                 EMPLOYEE DASHBOARD (ESS)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  TODAY'S ATTENDANCE                                     │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  Shift: 09:00 - 18:00                              │ │   │
│  │  │  Status: ● Not Checked In                         │ │   │
│  │  │  [CHECK IN]                                        │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  LEAVE BALANCE                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │ Annual   │  │  Sick    │  │  Casual  │              │   │
│  │  │ 12/15    │  │  3/5     │  │  2/4     │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  │  [Apply Leave]                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  LATEST PAYSLIP                                         │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  August 2026                                       │ │   │
│  │  │  Net Pay: ₹45,230.00                              │ │   │
│  │  │  [Download] [View Details]                        │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PENDING REQUESTS                                       │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ • Leave Request (Jul 2026) │ Pending Manager       │ │   │
│  │  │ • Expense Claim            │ Pending Finance       │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  QUICK ACTIONS                                          │   │
│  │  [Punch In] [Apply Leave] [Claim Expense] [View Tasks]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Employee Actions:**
- Click "Check In" → Record attendance
- Click "Apply Leave" → Submit leave request
- Click "Download Payslip" → View/download payslip
- Click "Claim Expense" → Submit expense claim
- Click "AI Assistant" → Ask HR-related questions

---

## 4. Organization Module Logic

### 4.1 Complete Flow: Creating a New Branch

```
┌─────────────────────────────────────────────────────────────────┐
│              CREATE NEW BRANCH WORKFLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: Company Admin → Organization → Branches              │
│                                                                 │
│  1. USER CLICKS "ADD BRANCH"                                   │
│     ┌──────────────────────────────────────────────┐           │
│     │  Form opens with fields:                     │           │
│     │  - Branch Code: BR-001                      │           │
│     │  - Branch Name: Mumbai Office               │           │
│     │  - Address: 123, Andheri East               │           │
│     │  - City: Mumbai                             │           │
│     │  - State: Maharashtra                       │           │
│     │  - Pincode: 400093                          │           │
│     │  - GPS Coordinates (optional)               │           │
│     │  - Geofence Radius: 100m                    │           │
│     │  - Is Head Office: No                       │           │
│     │  [SAVE] [CANCEL]                            │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  2. FRONTEND VALIDATION                                        │
│     ┌──────────────────────────────────────────────┐           │
│     │  Check required fields                       │           │
│     │  Validate pincode format                     │           │
│     │  Validate GPS coordinates if entered         │           │
│     │  Show inline validation errors               │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  3. BACKEND PROCESSING                                          │
│     ┌──────────────────────────────────────────────┐           │
│     │  a. Authenticate user                        │           │
│     │  b. Verify user has BRANCH_CREATE permission │           │
│     │  c. Get tenant_id from context               │           │
│     │  d. Validate branch code uniqueness          │           │
│     │  e. Create branch record                     │           │
│     │  f. Stamp tenant_id automatically            │           │
│     │  g. Log audit entry                          │           │
│     │  h. Return created branch data               │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  4. FRONTEND RESPONSE HANDLING                                 │
│     ┌──────────────────────────────────────────────┐           │
│     │  Success: Show toast notification            │           │
│     │  Refresh branch list                         │           │
│     │  Navigate to branch list                     │           │
│     │  Failure: Show error message                 │           │
│     └──────────────────────────────────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Department Hierarchy Management

```
┌─────────────────────────────────────────────────────────────────┐
│              DEPARTMENT HIERARCHY WORKFLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: Company Admin → Organization → Departments           │
│                                                                 │
│  VIEW HIERARCHY:                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Toggle Tree View] [List View]                         │   │
│  │                                                         │   │
│  │  ▼ ABC Technologies                                     │   │
│  │    ▼ Executive                                          │   │
│  │      ├── CEO Office                                     │   │
│  │      └── Board Secretariat                              │   │
│  │    ▼ Technology                                         │   │
│  │      ├── Engineering                                    │   │
│  │      │   ├── Backend                                    │   │
│  │      │   ├── Frontend                                   │   │
│  │      │   └── DevOps                                     │   │
│  │      ├── QA                                              │   │
│  │      └── IT Support                                      │   │
│  │    ▼ Operations                                          │   │
│  │      ├── HR                                              │   │
│  │      ├── Finance                                         │   │
│  │      └── Admin                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ACTIONS AVAILABLE:                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Add Department] [Edit] [Delete] [Move] [Assign Head]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ASSIGN DEPARTMENT HEAD:                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Department: Engineering                                │   │
│  │  Current Head: None                                     │   │
│  │  Select Employee: [Dropdown: All Employees]            │   │
│  │  [ASSIGN HEAD]                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Business Logic:**
- Departments can have child departments (unlimited nesting)
- Each department can have one head employee
- Department head gets manager permissions for that department
- Deleting a department: Check for child departments and employees first
- Moving a department: Update parent department ID

---

## 5. Employee Management Module Logic

### 5.1 Complete Employee Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               EMPLOYEE ONBOARDING WORKFLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: HR Admin → Employee → Add Employee                   │
│                                                                 │
│  STEP 1: PERSONAL INFORMATION                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Employee Code: EMP-2026-00142                         │   │
│  │  First Name: Priya                                     │   │
│  │  Last Name: Sharma                                     │   │
│  │  Email: priya.sharma@company.com                      │   │
│  │  Phone: +91-98765-43210                               │   │
│  │  DOB: 1990-05-15                                      │   │
│  │  Gender: Female                                       │   │
│  │  [NEXT]                                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  STEP 2: EMPLOYMENT DETAILS                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Branch: Mumbai Office                                 │   │
│  │  Department: Engineering                               │   │
│  │  Designation: Senior Software Engineer                │   │
│  │  Manager: Rajesh Kumar                                │   │
│  │  Joining Date: 2026-09-01                             │   │
│  │  Employment Type: Full Time                           │   │
│  │  Probation Period: 6 months                           │   │
│  │  [NEXT]                                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  STEP 3: STATUTORY & BANK DETAILS                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PAN: ABCDE1234F                                       │   │
│  │  Aadhaar: 1234-5678-9012                              │   │
│  │  UAN: 123456789012                                   │   │
│  │  Bank Name: HDFC Bank                                 │   │
│  │  Account Number: 12345678901                          │   │
│  │  IFSC: HDFC0001234                                   │   │
│  │  [NEXT]                                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  STEP 4: SALARY STRUCTURE                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Basic: ₹30,000                                        │   │
│  │  HRA: ₹12,000                                          │   │
│  │  Special Allowance: ₹8,000                             │   │
│  │  Total CTC: ₹50,000                                    │   │
│  │  [SAVE & SEND INVITATION]                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  BACKEND PROCESSING:                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  1. BEGIN TRANSACTION                                   │   │
│  │  2. Create Employee record                              │   │
│  │  3. Create User account                                 │   │
│  │  4. Create Tenant Membership                            │   │
│  │  5. Assign Employee role                                │   │
│  │  6. Create Salary Structure                             │   │
│  │  7. Generate Employee Code                              │   │
│  │  8. Send invitation email                               │   │
│  │  9. Log audit                                           │   │
│  │  10. COMMIT                                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  EMPLOYEE RECEIVES INVITATION:                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "Welcome to ABC Technologies!                        │   │
│  │  Please set your password: http://..."                │   │
│  │  [ACCEPT INVITATION]                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Bulk Employee Import

```
┌─────────────────────────────────────────────────────────────────┐
│                  BULK EMPLOYEE IMPORT                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. DOWNLOAD TEMPLATE                                          │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  [Download Excel Template]                              ││
│     │                                                         ││
│     │  Template includes:                                     ││
│     │  - Employee Code, First Name, Last Name, Email         ││
│     │  - Department, Designation, Manager                   ││
│     │  - Date of Joining, Date of Birth                     ││
│     │  - PAN, Aadhaar, Bank Account, IFSC                  ││
│     │  - Basic, HRA, Allowances                             ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. UPLOAD FILE                                               │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Drag & Drop or Click to Upload                        ││
│     │  [Select File: employees_bulk.xlsx]                    ││
│     │  [UPLOAD]                                              ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. BACKEND VALIDATION & PREVIEW                              │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Valid Rows: 45  Invalid Rows: 3                       ││
│     │                                                         ││
│     │  Invalid Rows:                                          ││
│     │  Row 12: Invalid email format                          ││
│     │  Row 23: Duplicate employee code                       ││
│     │  Row 34: Invalid PAN format                            ││
│     │                                                         ││
│     │  [Fix Errors] [Import Valid Rows]                      ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  4. BACKGROUND PROCESSING                                     │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Create Import Job                                  ││
│     │  b. Process in batches of 50                          ││
│     │  c. Create employees                                   ││
│     │  d. Create user accounts                               ││
│     │  e. Send invitations                                   ││
│     │  f. Track progress in UI                               ││
│     │                                                         ││
│     │  Progress: ████████████░░░░░░ 67%                      ││
│     │  Processed: 30/45                                      ││
│     │  [Cancel Import]                                       ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Employee Lifecycle States

```
┌─────────────────────────────────────────────────────────────────┐
│                  EMPLOYEE LIFECYCLE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                              │
│  │   INVITED    │ ← Invitation sent, not yet active           │
│  └──────┬───────┘                                              │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                              │
│  │  ONBOARDING  │ ← Completed forms, uploaded documents       │
│  └──────┬───────┘                                              │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                              │
│  │ PROBATION    │ ← Working, under probation period           │
│  └──────┬───────┘                                              │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                              │
│  │   ACTIVE     │ ← Confirmed, full employee                  │
│  └──────┬───────┘                                              │
│         │                                                       │
│    ┌────┴────┐                                                │
│    │         │                                                 │
│    ▼         ▼                                                 │
│  ┌──────────┐ ┌──────────────┐                                 │
│  │ ON LEAVE │ │ NOTICE PERIOD│ ← Resignation submitted        │
│  └────┬─────┘ └──────┬───────┘                                 │
│       │              │                                         │
│       ▼              ▼                                         │
│  ┌──────────┐ ┌──────────────┐                                 │
│  │ ACTIVE   │ │   EXITED     │ ← Last working day completed   │
│  │(Return)  │ └──────────────┘                                 │
│  └──────────┘                                                  │
│                                                                 │
│  STATE TRANSITIONS:                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  INVITED → ONBOARDING (User sets password)              │   │
│  │  ONBOARDING → PROBATION (Joining date reached)         │   │
│  │  PROBATION → ACTIVE (Probation period completed)        │   │
│  │  ACTIVE → ON LEAVE (Leave approved)                    │   │
│  │  ON LEAVE → ACTIVE (Return from leave)                 │   │
│  │  ACTIVE → NOTICE PERIOD (Resignation approved)         │   │
│  │  NOTICE PERIOD → EXITED (Last working day passed)      │   │
│  │  ACTIVE → EXITED (Termination)                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Attendance Module Logic

### 6.1 Complete Attendance Punch Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  ATTENDANCE PUNCH FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: Employee → Dashboard → [Check In]                    │
│                                                                 │
│  1. USER CLICKS CHECK IN                                       │
│     ┌──────────────────────────────────────────────┐           │
│     │  Browser requests location permission        │           │
│     │  [Allow] [Block]                            │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  2. FRONTEND CAPTURES GPS COORDINATES                          │
│     ┌──────────────────────────────────────────────┐           │
│     │  Latitude: 19.0760                           │           │
│     │  Longitude: 72.8777                         │           │
│     │  Accuracy: 15 meters                         │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  3. FRONTEND SENDS PUNCH REQUEST                               │
│     ┌──────────────────────────────────────────────┐           │
│     │  POST /api/v1/me/attendance/punch-in        │           │
│     │  {                                           │           │
│     │    "latitude": 19.0760,                     │           │
│     │    "longitude": 72.8777,                    │           │
│     │    "deviceId": "browser-chrome-123",       │           │
│     │    "source": "Web"                          │           │
│     │  }                                           │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  4. BACKEND PROCESSING                                          │
│     ┌──────────────────────────────────────────────┐           │
│     │  a. Authenticate user                        │           │
│     │  b. Get employee from session                │           │
│     │  c. Check employee is ACTIVE                │           │
│     │  d. Load today's shift                       │           │
│     │  e. Validate geo-fence (if enabled)         │           │
│     │  f. Check for duplicate punch               │           │
│     │  g. Create attendance event                  │           │
│     │  h. Create/update attendance session        │           │
│     │  i. Calculate late minutes                   │           │
│     │  j. Audit log                                │           │
│     │  k. Return success response                  │           │
│     └──────────────────────────────────────────────┘           │
│                          │                                      │
│                          ▼                                      │
│  5. FRONTEND UPDATES UI                                         │
│     ┌──────────────────────────────────────────────┐           │
│     │  ┌──────────────────────────────────────────┐ │           │
│     │  │  Checked In ✓                            │ │           │
│     │  │  09:07 AM                                │ │           │
│     │  │  Working: 02h 34m                        │ │           │
│     │  │  [CHECK OUT]                             │ │           │
│     │  └──────────────────────────────────────────┘ │           │
│     └──────────────────────────────────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Geo-Fence Validation Logic

```
┌─────────────────────────────────────────────────────────────────┐
│                   GEO-FENCE VALIDATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SCENARIO: Employee attempts to punch from outside office       │
│                                                                 │
│  1. EMPLOYEE PUNCHES FROM HOME                                 │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Location: 19.1136, 72.8697 (Home)                     ││
│     │  Office: 19.0760, 72.8777                             ││
│     │  Distance: 4.2 KM                                     ││
│     │  Geofence Radius: 100 meters                           ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. BACKEND VALIDATION                                         │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Calculate distance between points                  ││
│     │  b. Compare with office geofence radius                ││
│     │  c. Distance > Radius → Outside boundary               ││
│     │  d. Return error: OUTSIDE_GEOFENCE                    ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. FRONTEND HANDLES ERROR                                     │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  ❌ Cannot check in                                    ││
│     │  You are outside the office geofence area.             ││
│     │  Please move to office location or request             ││
│     │  permission for remote attendance.                     ││
│     │  [Request Remote Permission] [Retry]                   ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
│  MANAGER CAN OVERRIDE:                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Remote Attendance Request                              │   │
│  │  Employee: Priya Sharma                                │   │
│  │  Date: 2026-08-26                                      │   │
│  │  Reason: Client meeting at client location             │   │
│  │  [APPROVE] [REJECT]                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Attendance Regularization Request

```
┌─────────────────────────────────────────────────────────────────┐
│              ATTENDANCE REGULARIZATION FLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SCENARIO: Employee forgot to punch in                         │
│                                                                 │
│  FRONTEND: Employee → Attendance → Regularization               │
│                                                                 │
│  1. EMPLOYEE REQUESTS CORRECTION                               │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Date: 2026-08-25                                      ││
│     │  Actual Time: 09:15 AM                                ││
│     │  Reason: Forgot to punch in                           ││
│     │  [SUBMIT REQUEST]                                     ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. BACKEND PROCESSES REQUEST                                  │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Create regularization record                       ││
│     │  b. Set status: PENDING_MANAGER                        ││
│     │  c. Notify manager                                     ││
│     │  d. Return success                                     ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. MANAGER RECEIVES NOTIFICATION                              │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Pending Attendance Regularization                     ││
│     │  Employee: Priya Sharma                               ││
│     │  Date: 2026-08-25                                      ││
│     │  Requested Time: 09:15 AM                             ││
│     │  Reason: Forgot to punch in                           ││
│     │  [APPROVE] [REJECT]                                   ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  4. MANAGER APPROVES                                           │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Update regularization status: APPROVED             ││
│     │  b. Update attendance record                           ││
│     │  c. Notify employee                                   ││
│     │  d. Log audit                                         ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  5. EMPLOYEE SEES UPDATE                                       │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  ✅ Regularization Approved                            ││
│     │  Punch-in updated to 09:15 AM on 2026-08-25          ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Leave Management Module Logic

### 7.1 Complete Leave Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  LEAVE APPLICATION FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: Employee → Leaves → Apply Leave                      │
│                                                                 │
│  1. EMPLOYEE VIEWS LEAVE BALANCE                               │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Leave Balance Summary                                 ││
│     │  Annual Leave: 12/15 remaining                         ││
│     │  Sick Leave: 3/5 remaining                             ││
│     │  Casual Leave: 2/4 remaining                           ││
│     │  [APPLY LEAVE]                                         ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. EMPLOYEE FILLS APPLICATION                                │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Leave Type: Annual Leave                              ││
│     │  Start Date: 2026-09-15                                ││
│     │  End Date: 2026-09-17                                  ││
│     │  Days: 3                                               ││
│     │  Reason: Family vacation                               ││
│     │  [SUBMIT]                                              ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. BACKEND VALIDATION                                         │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Check leave type exists and active                 ││
│     │  b. Validate date range                                ││
│     │  c. Check for overlapping leaves                       ││
│     │  d. Check holiday/weekly off                           ││
│     │  e. Verify sufficient balance                          ││
│     │  f. Determine approval workflow                        ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  4. BACKEND CREATES REQUEST                                   │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Begin transaction                                  ││
│     │  b. Create leave request record                        ││
│     │  c. Set status based on workflow:                     ││
│     │     - If days > 3: PENDING_MANAGER                    ││
│     │     - If days ≤ 3: PENDING_HR                         ││
│     │  d. Reserve leave balance                             ││
│     │  e. Notify approvers                                   ││
│     │  f. Commit transaction                                 ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  5. MANAGER RECEIVES NOTIFICATION                              │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Pending Leave Request                                 ││
│     │  Employee: Priya Sharma                               ││
│     │  Leave Type: Annual Leave                              ││
│     │  Dates: 2026-09-15 to 2026-09-17 (3 days)            ││
│     │  Reason: Family vacation                              ││
│     │  [APPROVE] [REJECT]                                   ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Multi-Level Approval Logic

```
┌─────────────────────────────────────────────────────────────────┐
│              MULTI-LEVEL APPROVAL LOGIC                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  APPROVAL WORKFLOW CONFIGURATION:                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Leave Type: Annual Leave                               │   │
│  │  Level 1: Manager                                       │   │
│  │  Level 2: HR (if days > 3)                              │   │
│  │  Level 3: Department Head (if days > 10)                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  SCENARIO A: 2 DAYS LEAVE                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Employee Applies → Manager Approves → Approved        │   │
│  │                                                         │   │
│  │  1. PENDING_MANAGER                                     │   │
│  │  2. Manager approves → Approved                         │   │
│  │  3. Balance deducted                                    │   │
│  │  4. Notification sent to employee                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  SCENARIO B: 5 DAYS LEAVE                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Employee Applies → Manager → HR → Approved            │   │
│  │                                                         │   │
│  │  1. PENDING_MANAGER                                     │   │
│  │  2. Manager approves → PENDING_HR                      │   │
│  │  3. HR approves → Approved                              │   │
│  │  4. Balance deducted                                    │   │
│  │  5. Notification sent to employee                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  SCENARIO C: 12 DAYS LEAVE (Personal LWP)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Employee Applies → Manager → HR → Head → Approved     │   │
│  │                                                         │   │
│  │  1. PENDING_MANAGER                                     │   │
│  │  2. Manager approves → PENDING_HR                      │   │
│  │  3. HR approves → PENDING_HEAD                         │   │
│  │  4. Head approves → Approved                            │   │
│  │  5. Balance deducted (if applicable)                    │   │
│  │  6. Notification sent                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  REJECTION FLOW:                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Any Approver can Reject:                              │   │
│  │  1. Status changes to REJECTED                         │   │
│  │  2. Mandatory comment required                         │   │
│  │  3. Employee notified with rejection reason            │   │
│  │  4. Reserved balance restored                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Leave Balance Calculation

```
┌─────────────────────────────────────────────────────────────────┐
│             LEAVE BALANCE CALCULATION LOGIC                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ANNUAL LEAVE ACCRUAL:                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Opening Balance: 15 days (at start of year)            │   │
│  │  Monthly Accrual: 1.25 days (15/12)                    │   │
│  │  Used: 3 days (approved leaves)                        │   │
│  │  Pending: 2 days (awaiting approval)                   │   │
│  │                                                         │   │
│  │  Available Balance = Opening + Accrued - Used          │   │
│  │  Available Balance = 15 + 7.5 - 3 = 19.5 days         │   │
│  │  (including pending)                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  LEAVE TRANSACTIONS:                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Transaction Log:                                      │   │
│  │  ┌─────────────────────────────────────────────────────┐│   │
│  │  │  Date      │ Type        │ Amount │ Balance       ││   │
│  │  ├─────────────────────────────────────────────────────┤│   │
│  │  │ 2026-04-01 │ Opening     │  15.0  │  15.0         ││   │
│  │  │ 2026-04-30 │ Accrual     │   1.25 │  16.25        ││   │
│  │  │ 2026-05-31 │ Accrual     │   1.25 │  17.5         ││   │
│  │  │ 2026-06-15 │ Approved    │  -3.0  │  14.5         ││   │
│  │  │ 2026-06-30 │ Accrual     │   1.25 │  15.75        ││   │
│  │  └─────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  CARRY FORWARD LOGIC:                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Year End: March 31                                    │   │
│  │  Max Carry Forward: 5 days                             │   │
│  │  Closing Balance: 8 days                               │   │
│  │  Carry Forward: 5 days (capped)                       │   │
│  │  Encashment: 3 days (paid out)                         │   │
│  │  New Year Opening: 5 days                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Payroll Module Logic

### 8.1 Complete Payroll Processing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  PAYROLL PROCESSING FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: HR/Finance → Payroll → Process Payroll               │
│                                                                 │
│  STEP 1: INITIATE PAYROLL RUN                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Payroll Run: August 2026                              │   │
│  │  Company: ABC Technologies                             │   │
│  │  Employees: 342                                        │   │
│  │  Branch: All Branches                                  │   │
│  │  [INITIATE PAYROLL]                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  STEP 2: BACKEND DATA COLLECTION                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  a. Load all active employees for the month            │   │
│  │  b. For each employee:                                 │   │
│  │     - Load current salary structure                    │   │
│  │     - Calculate attendance summary                     │   │
│  │     - Calculate LOP days                               │   │
│  │     - Calculate OT hours                               │   │
│  │     - Get approved leaves                              │   │
│  │     - Get active loans and EMI                         │   │
│  │     - Get approved expenses                            │   │
│  │     - Calculate statutory deductions                   │   │
│  │  c. Create payroll run record                          │   │
│  │  d. Set status: PROCESSING                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  STEP 3: PAYROLL CALCULATION                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  For each employee:                                     │   │
│  │  ┌─────────────────────────────────────────────────────┐│   │
│  │  │  Gross Earnings:                                    ││   │
│  │  │  Basic: ₹30,000                                    ││   │
│  │  │  HRA: ₹12,000                                      ││   │
│  │  │  Special Allowance: ₹8,000                         ││   │
│  │  │  OT Pay: ₹2,500                                    ││   │
│  │  │  Expense Reimbursement: ₹1,500                     ││   │
│  │  │  Total Gross: ₹54,000                              ││   │
│  │  │                                                    ││   │
│  │  │  Deductions:                                        ││   │
│  │  │  Employee PF: ₹3,600 (12% of Basic)               ││   │
│  │  │  Employee ESI: ₹405 (0.75% of Gross)             ││   │
│  │  │  Professional Tax: ₹200                            ││   │
│  │  │  TDS: ₹2,500                                       ││   │
│  │  │  Loan EMI: ₹5,000                                  ││   │
│  │  │  Total Deductions: ₹11,705                         ││   │
│  │  │                                                    ││   │
│  │  │  Net Pay: ₹54,000 - ₹11,705 = ₹42,295            ││   │
│  │  └─────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  STEP 4: VALIDATION & EXCEPTIONS                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Validating payroll...                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐│   │
│  │  │  ✅ All employees have salary structure            ││   │
│  │  │  ✅ All bank details verified                      ││   │
│  │  │  ⚠️ 5 employees missing bank account              ││   │
│  │  │  ⚠️ 3 employees have negative net pay             ││   │
│  │  │  ✅ Statutory calculations verified                ││   │
│  │  └─────────────────────────────────────────────────────┘│   │
│  │  [Fix Issues] [Continue Anyway]                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  STEP 5: REVIEW & APPROVAL                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Payroll Summary:                                      │   │
│  │  Total Employees: 342                                  │   │
│  │  Total Gross: ₹18,468,000                             │   │
│  │  Total Deductions: ₹4,003,110                         │   │
│  │  Total Net Payable: ₹14,464,890                       │   │
│  │                                                         │   │
│  │  [APPROVE] [REJECT] [REQUEST CHANGES]                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  STEP 6: LOCK & GENERATE PAYSLIPS                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  a. Lock payroll run (status: LOCKED)                  │   │
│  │  b. Generate PDF payslips for each employee            │   │
│  │  c. Store payslips securely                            │   │
│  │  d. Notify employees via email/in-app                  │   │
│  │  e. Generate bank file for disbursement                │   │
│  │  f. Update audit logs                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Statutory Computation Logic

```
┌─────────────────────────────────────────────────────────────────┐
│              STATUTORY COMPUTATION LOGIC                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PROVIDENT FUND (PF) COMPUTATION:                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Basic + DA: ₹30,000                                   │   │
│  │  PF Cap: ₹15,000                                       │   │
│  │  Applicable Amount: ₹15,000 (capped)                   │   │
│  │                                                         │   │
│  │  Employee Contribution: 12% = ₹1,800                   │   │
│  │  Employer Contribution: 12% = ₹1,800                   │   │
│  │  ┌─────────────────────────────────────────────────────┐│   │
│  │  │  Employer Split:                                   ││   │
│  │  │  EPS: 8.33% = ₹1,249                              ││   │
│  │  │  EPF: 3.67% = ₹551                                 ││   │
│  │  │  EDLI: 0.5% = ₹75                                 ││   │
│  │  │  Admin: 0.5% = ₹75                                ││   │
│  │  └─────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ESIC COMPUTATION:                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Gross Wages: ₹54,000                                  │   │
│  │  ESIC Limit: ₹21,000                                   │   │
│  │  If Gross ≤ ₹21,000:                                   │   │
│  │    Employee: 0.75% = ₹157                              │   │
│  │    Employer: 3.25% = ₹682                              │   │
│  │  Else: Not Applicable                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  PROFESSIONAL TAX (PT) COMPUTATION (Maharashtra):             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Monthly Slabs:                                        │   │
│  │  ₹0 - ₹7,500: No Tax                                  │   │
│  │  ₹7,501 - ₹10,000: ₹175                               │   │
│  │  ₹10,001 - ₹15,000: ₹300                              │   │
│  │  > ₹15,000: ₹200                                       │   │
│  │                                                         │   │
│  │  For Gross ₹54,000 → PT = ₹200                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  TDS COMPUTATION:                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Annual Projection:                                     │   │
│  │  Gross Salary: ₹54,000 × 12 = ₹648,000                │   │
│  │  Chapter VI-A Deductions: ₹50,000                     │   │
│  │  Taxable Income: ₹598,000                             │   │
│  │                                                         │   │
│  │  New Regime Tax:                                        │   │
│  │  ₹0-₹300,000: 0%                                       │   │
│  │  ₹300,001-₹600,000: 5% = ₹14,900                     │   │
│  │  ₹600,001-₹900,000: 10% = ₹0                           │   │
│  │  Total Tax: ₹14,900 + Cess (4%) = ₹15,496             │   │
│  │                                                         │   │
│  │  Monthly TDS: ₹15,496 / 12 = ₹1,291                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Expense Management Module Logic

### 9.1 Expense Claim Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  EXPENSE CLAIM FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: Employee → Expenses → Submit Claim                   │
│                                                                 │
│  1. EMPLOYEE SUBMITS EXPENSE                                   │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Category: Travel                                      ││
│     │  Expense Date: 2026-08-25                              ││
│     │  Amount: ₹2,500                                        ││
│     │  Merchant: Indian Railways                            ││
│     │  Description: Train ticket for client meeting          ││
│     │  Receipt: [Upload File]                               ││
│     │  [SUBMIT]                                              ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. BACKEND PROCESSING                                         │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Validate expense amount                            ││
│     │  b. Verify receipt upload                              ││
│     │  c. Check expense policy limits                       ││
│     │  d. Create expense claim record                        ││
│     │  e. Set status: PENDING_MANAGER                        ││
│     │  f. Notify manager                                     ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. MANAGER APPROVES                                          │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Review expense details and receipt                 ││
│     │  b. Approve or reject with reason                      ││
│     │  c. If approved: status → PENDING_FINANCE             ││
│     │  d. Notify finance team                                ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  4. FINANCE APPROVES                                          │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Verify policy compliance                          ││
│     │  b. Check budget availability                          ││
│     │  c. Approve or reject with reason                      ││
│     │  d. If approved: status → REIMBURSEMENT_PENDING       ││
│     │  e. Add to next payroll reimbursement batch            ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  5. REIMBURSEMENT IN PAYROLL                                  │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Payroll run picks up approved claims               ││
│     │  b. Add to employee's earnings                         ││
│     │  c. Include in payslip as EXPENSE_REIMBURSEMENT       ││
│     │  d. Update claim status → REIMBURSED                  ││
│     │  e. Notify employee                                    ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Loan Management Module Logic

### 10.1 Loan Application & EMI Recovery

```
┌─────────────────────────────────────────────────────────────────┐
│                  LOAN MANAGEMENT FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: Employee → Loans → Apply for Loan                    │
│                                                                 │
│  1. EMPLOYEE APPLIES FOR LOAN                                  │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Loan Type: Salary Advance                             ││
│     │  Amount: ₹50,000                                       ││
│     │  Tenure: 6 months                                      ││
│     │  Reason: Medical emergency                             ││
│     │  [SUBMIT]                                              ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. BACKEND PROCESSING                                         │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Check employee eligibility                         ││
│     │  b. Validate loan amount against policy                ││
│     │  c. Create loan application record                     ││
│     │  d. Set status: PENDING_HR                             ││
│     │  e. Generate amortization schedule                     ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. HR & FINANCE APPROVE                                      │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. HR approves → status: PENDING_FINANCE             ││
│     │  b. Finance approves → status: APPROVED                ││
│     │  c. Create loan account record                         ││
│     │  d. Set disbursement date                              ││
│     │  e. Notify employee                                    ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  4. EMI SCHEDULE GENERATION                                   │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Loan Amount: ₹50,000                                  ││
│     │  Tenure: 6 months                                      ││
│     │  Interest: 0% (Salary Advance)                         ││
│     │                                                         ││
│     │  EMI Schedule:                                         ││
│     │  ┌─────────────────────────────────────────────────────┐││
│     │  │  Month  │ EMI     │ Principal │ Balance            │││
│     │  ├─────────────────────────────────────────────────────┤││
│     │  │  Sep 26 │ ₹8,333  │ ₹8,333   │ ₹41,667            │││
│     │  │  Oct 26 │ ₹8,333  │ ₹8,333   │ ₹33,334            │││
│     │  │  Nov 26 │ ₹8,333  │ ₹8,333   │ ₹25,001            │││
│     │  │  Dec 26 │ ₹8,333  │ ₹8,333   │ ₹16,668            │││
│     │  │  Jan 27 │ ₹8,333  │ ₹8,333   │ ₹8,335             │││
│     │  │  Feb 27 │ ₹8,335  │ ₹8,335   │ ₹0                 │││
│     │  └─────────────────────────────────────────────────────┘││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  5. AUTOMATIC EMI RECOVERY                                    │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Payroll run queries active loans                   ││
│     │  b. Check EMI for current month                        ││
│     │  c. Add to deductions: LOAN_RECOVERY                   ││
│     │  d. Deduct from salary                                 ││
│     │  e. Update loan balance                                ││
│     │  f. Mark EMI as recovered                              ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Asset Management Module Logic

### 11.1 Asset Allocation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  ASSET ALLOCATION FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: HR Admin → Assets → Allocate Asset                   │
│                                                                 │
│  1. HR SELECTS ASSET TO ALLOCATE                               │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Asset Code: LAP-2026-001                              ││
│     │  Asset Name: Dell XPS 13                              ││
│     │  Serial Number: XPS-12345-67890                       ││
│     │  Status: Available                                     ││
│     │  [ALLOCATE]                                            ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. HR ASSIGNS TO EMPLOYEE                                    │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Allocate to: Priya Sharma                            ││
│     │  Employee ID: EMP-2026-00142                          ││
│     │  Department: Engineering                              ││
│     │  Allocation Date: 2026-09-01                         ││
│     │  Expected Return: 2027-09-01                         ││
│     │  Condition: Good                                      ││
│     │  [CONFIRM ALLOCATION]                                  ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. BACKEND PROCESSING                                         │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Verify asset availability                          ││
│     │  b. Create asset allocation record                     ││
│     │  c. Update asset status → ASSIGNED                     ││
│     │  d. Update employee's asset list                       ││
│     │  e. Notify employee                                   ││
│     │  f. Log audit                                         ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  4. EMPLOYEE ACKNOWLEDGES                                     │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Asset Allocation Notification                        ││
│     │                                                         ││
│     │  Assigned to you:                                      ││
│     │  Dell XPS 13 (LAP-2026-001)                           ││
│     │  Serial: XPS-12345-67890                              ││
│     │  Condition: Good                                      ││
│     │  Date: 2026-09-01                                     ││
│     │                                                         ││
│     │  [ACKNOWLEDGE RECEIPT]                                 ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Asset Return Flow (During Exit)

```
┌─────────────────────────────────────────────────────────────────┐
│                  ASSET RETURN FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: HR Admin → Assets → Return Asset                     │
│                                                                 │
│  1. INITIATE ASSET RETURN                                      │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Employee: Priya Sharma (EMP-2026-00142)              ││
│     │  Action: Resignation / Termination                     ││
│     │  Assets to Return:                                     ││
│     │  ┌─────────────────────────────────────────────────────┐││
│     │  │  ✓ LAP-2026-001: Dell XPS 13                      ││
│     │  │  ✓ IDC-2026-001: Access Card                      ││
│     │  │  □ PHONE-2026-001: iPhone 13                     ││
│     │  └─────────────────────────────────────────────────────┘││
│     │  [PROCESS RETURN]                                      ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. BACKEND PROCESSES RETURN                                  │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Check all assets returned                          ││
│     │  b. Inspect asset condition                            ││
│     │  c. Update asset allocation status → RETURNED          ││
│     │  d. Update asset status → AVAILABLE                    ││
│     │  e. Update employee exit clearance                     ││
│     │  f. Log audit                                         ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. EXIT CLEARANCE UPDATE                                     │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Employee: Priya Sharma                               ││
│     │  Exit Clearance Progress:                              ││
│     │  ┌─────────────────────────────────────────────────────┐││
│     │  │  ✓ Asset Return                                    ││
│     │  │  ✓ Document Handover                              ││
│     │  │  ✓ Access Revoked                                 ││
│     │  │  □ F&F Settlement                                 ││
│     │  └─────────────────────────────────────────────────────┘││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Performance Management Module Logic

### 12.1 Performance Review Cycle Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              PERFORMANCE REVIEW CYCLE FLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: HR Admin → Performance → Create Review Cycle         │
│                                                                 │
│  STEP 1: HR CREATES REVIEW CYCLE                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Cycle Name: Q3 2026 Performance Review               │   │
│  │  Start Date: 2026-10-01                               │   │
│  │  End Date: 2026-10-31                                 │   │
│  │  Department: All                                       │   │
│  │  Type: Quarterly                                      │   │
│  │  [CREATE CYCLE]                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  STEP 2: EMPLOYEE SETS GOALS                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Goal 1: Complete project Alpha                        │   │
│  │  Type: OKR                                             │   │
│  │  Weightage: 40%                                        │   │
│  │  Target: 100% completion                               │   │
│  │                                                         │   │
│  │  Goal 2: Reduce bug count                              │   │
│  │  Type: KPI                                             │   │
│  │  Weightage: 30%                                        │   │
│  │  Target: < 5 critical bugs                             │   │
│  │                                                         │   │
│  │  Goal 3: Team collaboration                           │   │
│  │  Type: OKR                                             │   │
│  │  Weightage: 30%                                        │   │
│  │  Target: 4.5/5 peer rating                             │   │
│  │  [SUBMIT GOALS]                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  STEP 3: EMPLOYEE SELF-REVIEW                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Goal 1: Completed 95%                                 │   │
│  │  Self Rating: 4/5                                      │   │
│  │  Comments: Project mostly completed, delayed due...   │   │
│  │                                                         │   │
│  │  Goal 2: 3 critical bugs                               │   │
│  │  Self Rating: 5/5                                      │   │
│  │  Comments: All critical bugs resolved promptly...      │   │
│  │                                                         │   │
│  │  [SUBMIT SELF REVIEW]                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  STEP 4: MANAGER REVIEWS                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Employee: Priya Sharma                               │   │
│  │  Self Rating Average: 4.5/5                           │   │
│  │  Manager Assessment:                                   │   │
│  │  Goal 1 Rating: 4/5 (Achieved 95%)                    │   │
│  │  Goal 2 Rating: 5/5 (Exceeded target)                 │   │
│  │  Goal 3 Rating: 4/5 (Good collaboration)              │   │
│  │  Overall Rating: 4.3/5                                │   │
│  │  Comments: Highly motivated employee...                │   │
│  │  [SUBMIT REVIEW]                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  STEP 5: HR FINALIZES                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  a. Compile all reviews                                 │   │
│  │  b. Calibrate ratings across teams                     │   │
│  │  c. Apply bell curve (if configured)                   │   │
│  │  d. Finalize ratings                                   │   │
│  │  e. Determine increments (if any)                      │   │
│  │  f. Notify employees                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Task Management Module Logic

### 13.1 Task Creation & Assignment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  TASK MANAGEMENT FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: Manager → Tasks → Create Task                        │
│                                                                 │
│  1. MANAGER CREATES TASK                                       │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Title: Update website homepage                       ││
│     │  Description: Redesign hero section with new images   ││
│     │  Assign To: Priya Sharma                             ││
│     │  Priority: High                                       ││
│     │  Due Date: 2026-09-10                                 ││
│     │  [CREATE TASK]                                        ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. BACKEND PROCESSING                                         │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Validate assignee exists                          ││
│     │  b. Create task record                                 ││
│     │  c. Set status: TODO                                   ││
│     │  d. Notify assignee                                    ││
│     │  e. Log audit                                         ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. EMPLOYEE VIEWS TASK                                       │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  My Tasks:                                              ││
│     │  ┌─────────────────────────────────────────────────────┐││
│     │  │  🔄 Update website homepage                       │││
│     │  │  Due: 2026-09-10 (High)                          │││
│     │  │  Status: TODO                                     │││
│     │  │  [START] [VIEW DETAILS]                           │││
│     │  └─────────────────────────────────────────────────────┘││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  4. TASK STATUS UPDATES                                       │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Status Flow:                                           ││
│     │  ┌─────────┐    ┌───────────┐    ┌───────────┐       ││
│     │  │  TODO   │ → │IN PROGRESS│ → │  REVIEW   │       ││
│     │  └─────────┘    └───────────┘    └─────┬─────┘       ││
│     │                                          │               ││
│     │                                   ┌──────▼──────┐       ││
│     │                                   │  COMPLETED │       ││
│     │                                   └─────────────┘       ││
│     │                                                         ││
│     │  If any issue: TODO → CANCELLED                        ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  5. COMPLETION & VERIFICATION                                  │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Employee marks task as COMPLETED                   ││
│     │  b. Manager reviews completion                         ││
│     │  c. Manager verifies task quality                      ││
│     │  d. Task marked as VERIFIED                           ││
│     │  e. Notification sent                                  ││
│     │  f. Update task history                                ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 14. Helpdesk Module Logic

### 14.1 Helpdesk Ticket Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  HELPDESK TICKET FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: Employee → Helpdesk → Create Ticket                  │
│                                                                 │
│  1. EMPLOYEE RAISES TICKET                                     │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Category: Payroll                                     ││
│     │  Subject: Missing January 2026 payslip                ││
│     │  Priority: High                                        ││
│     │  Description: I cannot find my payslip for Jan 2026   ││
│     │  Attachment: [Screenshot]                             ││
│     │  [SUBMIT TICKET]                                       ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. BACKEND PROCESSING                                         │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Validate inputs                                    ││
│     │  b. Generate ticket number: TK-2026-0042              ││
│     │  c. Create ticket record                               ││
│     │  d. Set status: OPEN                                   ││
│     │  e. Notify helpdesk queue                              ││
│     │  f. Route to appropriate category                       ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. AGENT ASSIGNMENT                                          │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Helpdesk agent picks ticket                        ││
│     │  b. Set status: IN_PROGRESS                            ││
│     │  c. Assign to agent: Raj Finance                       ││
│     │  d. Notify employee                                    ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  4. AGENT INVESTIGATES & RESPONDS                            │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Agent: Raj Finance                                    ││
│     │  Comment: I see the payslip in the system.             ││
│     │  Was it generated? Let me check the payroll run.      ││
│     │  [ADD COMMENT]                                         ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  5. EMPLOYEE RESPONDS                                         │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Employee: Priya Sharma                               ││
│     │  Comment: Yes, please check. I can't access it.      ││
│     │  [ADD COMMENT]                                         ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  6. RESOLUTION                                                │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Agent resolves issue                               ││
│     │  b. Set status: RESOLVED                               ││
│     │  c. Add resolution notes                               ││
│     │  d. Notify employee                                    ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  7. EMPLOYEE VERIFIES & CLOSES                                │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Employee verifies resolution                       ││
│     │  b. If satisfied: Mark as CLOSED                       ││
│     │  c. If not satisfied: Reopen ticket                    ││
│     │  d. Customer satisfaction survey (optional)            ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 15. Document Management Module Logic

### 15.1 Document Upload & Verification Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              DOCUMENT MANAGEMENT FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: Employee/HR → Documents → Upload Document            │
│                                                                 │
│  1. EMPLOYEE UPLOADS DOCUMENT                                  │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Document Type: Aadhaar                                ││
│     │  Title: Aadhaar Card - Priya Sharma                  ││
│     │  File: aadhaar_priya.pdf (2.3 MB)                     ││
│     │  Expiry Date: 2036-05-15                              ││
│     │  [UPLOAD]                                              ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. BACKEND PROCESSING                                         │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Validate file type (PDF, JPG, PNG)                ││
│     │  b. Check file size (max 10 MB)                       ││
│     │  c. Scan for malware (if configured)                  ││
│     │  d. Generate unique file key                          ││
│     │  e. Upload to blob storage                             ││
│     │  f. Create document record                             ││
│     │  g. Set verification status: PENDING                   ││
│     │  h. Notify HR for verification                         ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. HR VERIFIES DOCUMENT                                      │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Document: Aadhaar Card                               ││
│     │  Employee: Priya Sharma                              ││
│     │  Status: PENDING VERIFICATION                        ││
│     │  [VERIFY] [REJECT]                                    ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  4. DOCUMENT EXPIRY MONITORING                                │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Daily Check:                                          ││
│     │  a. Query documents with expiry date in 30 days       ││
│     │  b. Send notifications to employee and HR             ││
│     │  c. Generate expiry report                            ││
│     │                                                         ││
│     │  Sample Notification:                                  ││
│     │  "Your Aadhaar document will expire in 30 days.       ││
│     │   Please upload a new copy."                           ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 16. Compliance Module Logic

### 16.1 Statutory Filing Preparation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               STATUTORY FILING FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: Finance → Compliance → Generate Reports              │
│                                                                 │
│  1. SELECT FILING TYPE                                         │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Select Report Type:                                   ││
│     │  ○ EPF ECR (Monthly)                                  ││
│     │  ○ ESIC Monthly Return                                ││
│     │  ○ Professional Tax Return                            ││
│     │  ○ TDS Quarterly Return                               ││
│     │  ○ Form 16 (Annual)                                   ││
│     │                                                         ││
│     │  Month: August 2026                                    ││
│     │  [GENERATE REPORT]                                     ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. BACKEND GENERATES EPF ECR                                 │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Query employees eligible for EPF                  ││
│     │  b. Calculate PF contributions                         ││
│     │  c. Group by establishment code                        ││
│     │  d. Format as per ECR specifications                   ││
│     │  e. Generate .txt file                                 ││
│     │  f. Validate against schema                            ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. PREVIEW & EXPORT                                          │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  EPF ECR Report - August 2026                         ││
│     │  ┌─────────────────────────────────────────────────────┐││
│     │  │  Employee │ EPF    │ EPS    │ EDLI  │ Admin       │││
│     │  ├─────────────────────────────────────────────────────┤││
│     │  │  Priya    │ 1,800  │ 1,249  │ 75    │ 75          │││
│     │  │  Raj      │ 2,500  │ 1,735  │ 104   │ 104         │││
│     │  │  ...      │ ...    │ ...    │ ...   │ ...         │││
│     │  │  Total    │ 45,000 │ 31,225 │ 1,875 │ 1,875       │││
│     │  └─────────────────────────────────────────────────────┘││
│     │  [DOWNLOAD .TXT] [VIEW DETAILS]                        ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 17. Reporting Module Logic

### 17.1 Report Generation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  REPORT GENERATION FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND: Any User → Reports → Select Report Type             │
│                                                                 │
│  1. SELECT REPORT TYPE                                         │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Report Categories:                                    ││
│     │  ○ Headcount Report                                    ││
│     │  ○ Attendance Report                                   ││
│     │  ○ Leave Utilization Report                            ││
│     │  ○ Payroll Cost Report                                 ││
│     │  ○ Attrition Report                                    ││
│     │  ○ Custom Report Builder                               ││
│     │                                                         ││
│     │  Date Range: 2026-07-01 to 2026-08-31                ││
│     │  [GENERATE REPORT]                                     ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. REPORT GENERATION PROCESS                                 │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Create report job in background                   ││
│     │  b. Query data from relevant modules                   ││
│     │  c. Aggregate and transform data                       ││
│     │  d. Generate chart data (if applicable)               ││
│     │  e. Generate Excel file                                ││
│     │  f. Store in blob storage                              ││
│     │  g. Notify user when ready                             ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. NOTIFICATION & DOWNLOAD                                   │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Report Ready!                                         ││
│     │  Type: Payroll Cost Report                             ││
│     │  Period: July - August 2026                           ││
│     │  Size: 2.4 MB                                         ││
│     │  [DOWNLOAD] [VIEW DASHBOARD]                           ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 18. Cross-Cutting Workflows

### 18.1 Notification Engine Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  NOTIFICATION FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EVENT TRIGGERS NOTIFICATION:                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Events:                                                │   │
│  │  - Leave Approved/Rejected                              │   │
│  │  - Payroll Finalized                                    │   │
│  │  - Payslip Available                                    │   │
│  │  - Expense Approved/Rejected                            │   │
│  │  - Missed Punch Reminder                                │   │
│  │  - Document Expiry Alert                                │   │
│  │  - Task Assignment                                      │   │
│  │  - Ticket Resolution                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  NOTIFICATION PROCESSING:                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  a. Event received                                      │   │
│  │  b. Determine recipients                                │   │
│  │  c. Load notification template                          │   │
│  │  d. Personalize content                                 │   │
│  │  e. Create notification record                          │   │
│  │  f. Queue for delivery                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  CHANNEL DELIVERY:                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │  In-App    │  │   Email    │  │   Push/SMS     │  │   │
│  │  ├─────────────┤  ├─────────────┤  ├─────────────────┤  │   │
│  │  │ ✓ System   │  │ ✓ Critical │  │ ✓ High Priority │  │   │
│  │  │ ✓ All users│  │ ✓ Document │  │ ✓ Field alerts  │  │   │
│  │  │ ✓ Real-time│  │ ✓ Payroll  │  │ ✓ Time-sensitive│  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 18.2 Audit Logging Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUDIT LOGGING FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EVERY MUTATING ACTION IS LOGGED:                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  What is logged:                                        │   │
│  │  - Create: Employee created, user created               │   │
│  │  - Update: Salary changed, role changed                 │   │
│  │  - Delete: Employee terminated, asset retired           │   │
│  │  - Approve: Leave approved, payroll approved            │   │
│  │  - Login: Successful/failed attempts                    │   │
│  │  - Access: Document access, sensitive data view         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  LOG STRUCTURE:                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  {                                                      │   │
│  │    "Id": "audit-123",                                  │   │
│  │    "UserId": "user-456",                               │   │
│  │    "TenantId": "tenant-789",                           │   │
│  │    "Action": "EMPLOYEE_CREATED",                       │   │
│  │    "Entity": "Employee",                               │   │
│  │    "EntityId": "emp-101",                              │   │
│  │    "OldValues": null,                                  │   │
│  │    "NewValues": {                                      │   │
│  │      "email": "priya@company.com",                    │   │
│  │      "department": "Engineering"                       │   │
│  │    },                                                  │   │
│  │    "IPAddress": "192.168.1.100",                       │   │
│  │    "UserAgent": "Chrome/120...",                      │   │
│  │    "Timestamp": "2026-08-26T09:15:00Z"               │   │
│  │  }                                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 18.3 Support/Impersonation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  SUPPORT IMPERSONATION FLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SCENARIO: Super Admin needs to assist tenant                  │
│                                                                 │
│  1. SUPER ADMIN INITIATES SESSION                              │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Select Tenant: ABC Technologies                       ││
│     │  Select User: Priya Sharma (HR Admin)                 ││
│     │  Reason: Assisting with payroll issue                  ││
│     │  Duration: 30 minutes                                  ││
│     │  [INITIATE SUPPORT SESSION]                            ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  2. BACKEND CREATES SESSION                                   │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Verify Super Admin permissions                    ││
│     │  b. Create temporary support token                     ││
│     │  c. Set permissions (read-only + specific actions)    ││
│     │  d. Set expiry                                        ││
│     │  e. Log session start                                 ││
│     │  f. Return session data                               ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  3. UI INDICATES SUPPORT MODE                                 │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  ⚠️ SUPPORT MODE ACTIVE                                ││
│     │  Tenant: ABC Technologies                             ││
│     │  Acting As: Priya Sharma (HR Admin)                  ││
│     │  Expires: 30 minutes                                  ││
│     │  [END SESSION]                                         ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  4. ALL ACTIONS AUDITED                                       │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  Audit Log shows:                                      ││
│     │  - Actor: Super Admin                                 ││
│     │  - Context: Acting as HR Admin                       ││
│     │  - All actions tagged: SUPPORT_IMPERSONATION          ││
│     └─────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  5. SESSION EXPIRES/TERMINATES                                │
│     ┌─────────────────────────────────────────────────────────┐│
│     │  a. Auto-expires after 30 minutes                     ││
│     │  b. Super Admin can end early                         ││
│     │  c. All temporary permissions revoked                 ││
│     │  d. Log session end                                   ││
│     │  e. Return to normal mode                             ││
│     └─────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 18.4 Complete User Journey Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER JOURNEY SUMMARY                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SUPER ADMIN JOURNEY:                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Login → Platform Dashboard → Manage Tenants →          │   │
│  │  → View Tenant Data (Context Switch) → Support Session  │   │
│  │  → Manage Plans → Platform Settings → Logout            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  COMPANY ADMIN JOURNEY:                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Login → Company Dashboard → Configure Organization →   │   │
│  │  → Manage Employees → Approve Requests → Run Payroll →   │   │
│  │  → View Reports → Company Settings → Logout             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  HR ADMIN JOURNEY:                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Login → HR Dashboard → Manage Employees →              │   │
│  │  → Process Attendance → Manage Leave →                  │   │
│  │  → Handle Compliance → Generate Reports → Logout         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  MANAGER JOURNEY:                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Login → Manager Dashboard → View Team →               │   │
│  │  → Approve Leave/Expenses → Assign Tasks →             │   │
│  │  → Performance Reviews → Team Reports → Logout          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  EMPLOYEE JOURNEY:                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Login → ESS Dashboard → Punch In → Apply Leave →      │   │
│  │  → View Payslip → Submit Expense → Claim Loan →        │   │
│  │  → View Assets → Check Tasks → AI Assistant → Logout    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Implementation Notes

### Data Isolation Rules
1. All tenant-owned tables must include `tenant_id`
2. Global query filters automatically apply `tenant_id = current_tenant`
3. Cross-tenant access returns 403/404 immediately
4. Super Admin has view-only access to tenant data via context switch

### Authorization Rules
1. Every API endpoint requires explicit permission check
2. Frontend guards mirror backend permissions (but backend is authoritative)
3. Module visibility determined by permissions, not hardcoded roles
4. Employee self-service uses `/me` endpoints only

### Business Logic Rules
1. Payroll becomes immutable after LOCKED status
2. Leave balance calculations use transaction history, not just current balance
3. All financial operations use database transactions
4. Approval workflows configurable per module

### Security Rules
1. All PII data encrypted at rest (AES-GCM)
2. Audit logs for all mutating operations
3. Account lockout after 5 failed attempts
4. Session token rotation on each refresh