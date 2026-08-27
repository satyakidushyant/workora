# Workora API Testing & Automation Guide

This guide provides step-by-step instructions for importing, configuring, and executing the complete **Workora HRMS & SaaS API Suite** in Postman and Newman CLI.

---

## 1. Quick Start & Importing

### Step 1: Import Files into Postman
1. Open **Postman** (Desktop App or Web).
2. Click **Import** (top left).
3. Select and import both generated files:
   - `Workora.postman_collection.json`
   - `Workora.postman_environment.json`

### Step 2: Select the Environment
1. In the top-right environment dropdown, select **Workora Local Development**.
2. Verify that `baseUrl` is configured to `http://localhost:5041` (or `https://localhost:7027`).

---

## 2. Authentication & Automated Token Management

The collection features built-in test scripts that automatically handle JWT token lifecycle:

1. Navigate to **`01 - Authentication & Security`**.
2. Run **`01. SuperAdmin Login`** (or **`02. HRAdmin Login`**).
3. The Postman test script executes automatically:
   ```javascript
   const res = pm.response.json();
   if (res.data && res.data.accessToken) {
       pm.environment.set("accessToken", res.data.accessToken);
       pm.environment.set("refreshToken", res.data.refreshToken);
   }
   ```
4. All subsequent authenticated requests in the collection automatically inject:
   ```text
   Authorization: Bearer {{accessToken}}
   ```
5. When the access token expires, run **`04. Refresh Token`** to automatically rotate your token without re-entering credentials.

---

## 3. Dynamic Variable Chaining & CRUD Workflows

Every creation request captures its resulting ID and saves it into the environment. This enables continuous chained execution across modules.

### Example Workflow: Complete Employee Lifecycle
```text
1. 01 - Authentication -> SuperAdmin Login (Stores accessToken)
2. 05 - Company & Branches -> Create Branch (Stores branchId)
3. 06 - Departments -> Create Department (Stores departmentId)
4. 06 - Designations -> Create Designation (Stores designationId)
5. 07 - Employee Directory -> Create Employee (Stores employeeId)
6. 08 - Shifts -> Assign Shift to Employee
7. 12 - Salary Structure -> Assign Salary Structure to Employee
8. 10 - Attendance -> Clock-In (Check-In)
9. 11 - Leave Management -> Apply For Leave (Stores leaveRequestId)
10. 11 - Leave Management -> Approve Leave Request
11. 13 - Payroll -> Initialize Payroll Run -> Process -> Approve -> Disburse
12. 13 - Payroll -> Get My Payslips (Verifies generated payslip)
```

---

## 4. Multi-Tier Role-Based Testing (RBAC & PBAC)

Workora enforces strict Policy-Based Access Control (PBAC):

| Role | Pre-configured Credentials | Typical Scope |
|---|---|---|
| **SuperAdmin** | `admin@workora.com` / `Admin@123` | Full platform access, multi-tenant organizations, subscription plans |
| **Tenant Admin / HRAdmin** | `admin@workora.com` / `Admin@123` | Workforce lifecycle, time & attendance, leaves, recruitment, policies |
| **Finance Manager** | `admin@workora.com` / `Admin@123` | Salary compensation, monthly payroll runs, bank disbursement, statutory compliance |
| **Employee (ESS)** | `admin@workora.com` / `Admin@123` | Self-clocking, leave requests, own payslips, loan applications, helpdesk tickets |

### Verifying 403 Forbidden Access (Negative Security Testing)
- Log in as **Employee ESS** (`01 - Authentication -> 03. Employee Login`).
- Try to execute **`02 - SuperAdmin -> 01. Get Subscription Plans`** or **`13 - Payroll -> 02. Initialize Payroll Run`**.
- Expected Result: `403 Forbidden` (User lacks the required policy).

---

## 5. Automated Execution via Newman CLI

You can run the entire test suite in automated CI/CD pipelines using Newman:

### Installation
```bash
npm install -g newman newman-reporter-htmlextra
```

### Run Complete Collection
```bash
newman run Workora.postman_collection.json \
    -e Workora.postman_environment.json \
    --reporters cli,htmlextra \
    --reporter-htmlextra-export ./newman-report.html
```

### Run Specific Folder (e.g., Attendance Module)
```bash
newman run Workora.postman_collection.json \
    -e Workora.postman_environment.json \
    --folder "10 - Attendance Management"
```

---

## 6. Seed Data & Defaults

The backend seeder (`DatabaseSeeder.cs`) automatically seeds the following foundational data on initial database migration:
- **System Permissions**: Full 44-permission catalog across all modules.
- **System Roles**: SuperAdmin, HRAdmin, FinanceManager, Manager, Employee.
- **Subscription Plans**: Starter ($49/mo), Growth ($199/mo), Enterprise ($499/mo).
- **Platform Owner Account**: `admin@workora.com` / `Admin@123`.
