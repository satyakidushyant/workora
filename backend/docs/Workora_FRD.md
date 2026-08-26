# Workora — Functional Requirements Document (FRD)

**360° Human Resource Management & Payroll Platform**

| Field | Detail |
|---|---|
| Document Title | Workora — Functional Requirements Document |
| Source Inputs | Tankhwa Patra System Architecture Analysis; Workora Backend Technical Architecture v2.0; PBAC/RBAC & Multi-Tenant 3-Tier Integration Plan |
| Version | 2.0 |
| Status | Draft for Stakeholder Review |
| Prepared For | Product, Engineering, and QA Teams |
| Scope | 3-Tier SaaS HRMS — Super Admin, Company Admin/HR/Finance/Manager, Employee Self-Service |

---

## Document Control

### Revision History

| Version | Date | Author | Description |
|---|---|---|---|
| 0.1 | 2026-05-10 | Solution Architecture Team | Initial architecture draft |
| 1.0 | 2026-07-02 | Solution Architecture Team | Baseline architecture for development kickoff |
| 2.0 | 2026-08-25 | Solution Architecture Team | 360° HRMS transformation; 3-tier SaaS architecture |
| FRD 2.0 | 2026-08-26 | Product Team | Complete rewrite based on Tankhwa Patra analysis + architecture spec consolidation |

### Purpose of This Document

This FRD defines the functional and non-functional requirements for Workora, a multi-tenant, cloud-native 360° Human Resource Management and Payroll SaaS platform. It is based on an analysis of Tankhwa Patra's publicly documented HRMS capabilities combined with Workora's technical architecture specifications.

> **Why this document exists** — Tankhwa Patra represents a mature, production-tested HRMS platform. This document translates its documented capabilities into a structured, traceable set of requirements for Workora, ensuring feature parity where appropriate while leveraging Workora's modern .NET 9 / Clean Architecture / DDD / CQRS foundation.

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for Workora, a multi-tenant, cloud-native 360° Human Resource Management and Payroll SaaS platform. It is intended for use by product owners, backend and frontend engineers, QA, and security reviewers as the single source of truth for what the system must do, who may do it, and how correctness will be verified.

### 1.2 Scope
- **In scope:** platform-level SaaS governance (tenant onboarding, subscription/module licensing); tenant-level HR, attendance, leave, payroll, statutory compliance, loans, expenses, field tracking, assets, tasks, performance, helpdesk, documents, and policies; employee self-service; permission-based access control and strict multi-tenant data isolation; the Workora AI conversational assistant.
- **Out of scope for this revision:** payment gateway integration for SaaS billing collection, native mobile app store submission processes, and any country's statutory payroll rules other than India (EPF/ESIC/PT/TDS/Gratuity/Bonus).

### 1.3 Definitions & Abbreviations

| Term | Definition |
|---|---|
| HRMS | Human Resource Management System |
| ESS | Employee Self-Service portal (Level 3 tier) |
| PBAC | Permission-Based Access Control — authorization decided by discrete `{module}.{action}` permission strings rather than coarse role checks |
| RBAC | Role-Based Access Control — permissions grouped into named roles assigned to users |
| Tenant | A single customer organization onboarded onto the shared Workora platform, isolated by `tenant_id` |
| CQRS | Command Query Responsibility Segregation — the backend pattern separating write (Command) and read (Query) operations |
| LOP | Loss of Pay — unpaid absence days deducted in payroll |
| EMI | Equated Monthly Installment — recurring loan/advance repayment amount |
| ECR | Electronic Challan-cum-Return — the statutory EPF filing format |
| TDS | Tax Deducted at Source (Indian income tax withholding) |
| CTC | Cost to Company — total annual compensation package |
| FR / NFR / AC | Functional Requirement / Non-Functional Requirement / Acceptance Criterion |

### 1.4 References
- Tankhwa Patra — Business Landing Page & Product Features Documentation
- Workora — Backend Technical Architecture & System Documentation, v2.0
- PBAC, RBAC, and Multi-Tenant 3-Tier Architecture Integration — remediation plan

---

## 2. Overall Description

### 2.1 Product Perspective
Workora is a new, self-contained SaaS product built on .NET 9 / Clean Architecture / DDD / CQRS with a PostgreSQL data store, Angular frontend, and Azure-hosted infrastructure. It is the system of record for workforce, time, leave, payroll, and compliance data for each tenant company that onboards onto it.

### 2.2 The Three User Tiers

| Tier | Who | What they can do |
|---|---|---|
| **Level 1 — Super Admin** | Workora platform owner/operator | Onboard and suspend tenant organizations; define subscription plans and module licensing; view platform-wide analytics and audit logs; switch viewing context into any tenant for support purposes. |
| **Level 2 — Company Admin / HR / Finance / Manager** | Tenant-side administrators and people managers | Configure their own company (branches, departments, shifts, leave policy); manage their own employees end-to-end; approve leave, regularization, expense, loan, and payroll workflows; run and lock payroll; view statutory compliance reports — all strictly scoped to their own company. |
| **Level 3 — Employee (ESS)** | Every onboarded employee | Punch attendance; apply for and track leave; view/download payslips; submit expense claims and loan requests; view assigned assets and tasks; acknowledge policies; use the Workora AI assistant. |

### 2.3 Operating Environment
- .NET 9 / ASP.NET Core Web API backend, PostgreSQL 16 with Row-Level Security, Redis distributed cache, Azure Service Bus event backbone.
- Web admin dashboard and mobile-responsive ESS portal (Angular), consuming versioned REST APIs (`/api/v1/...`).
- Deployed on Azure App Service (API), AKS (background workers), Azure Blob Storage (documents), Azure Application Insights (observability).

### 2.4 Assumptions & Constraints
- All statutory payroll calculations target Indian regulations only (EPF/ESIC/PT/TDS/Gratuity/Bonus) for this release.
- Multi-tenancy uses a shared database with row-level isolation, not database-per-tenant — this is a deliberate cost/operability trade-off that makes server-side tenant-filter enforcement a release-blocking requirement rather than a nice-to-have.
- The existing defect where `/auth/me` returns a hardcoded Super Admin role must be fixed before any other access-control requirement in this document can be meaningfully verified.

---

## 3. Functional Requirements — Core HRMS Modules

Each subsection below corresponds to one functional module of the platform. Requirements are numbered `FR-<module>.<n>` for traceability into test cases and sprint tickets. Priority follows MoSCoW (Must / Should / Could).

---

### 3.1 Platform Subscriptions & Tiered Plans

**Primary Actor(s):** Super Admin

*Allows the Super Admin to define SaaS subscription tiers (Starter, Professional, Enterprise, Custom), pricing, seat limits, and the module-license matrix each tier unlocks.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-01.1 | The system shall allow a Super Admin to create, update, and delete subscription plans, each with a code, name, base monthly price, per-employee price, max seat count, and a JSON list of licensed module codes. | Must |
| FR-01.2 | The system shall prevent deletion of a subscription plan while one or more tenant organizations are actively subscribed to it. | Must |
| FR-01.3 | The system shall allow Super Admin to list and inspect all subscription plans with their module matrices. | Must |
| FR-01.4 | The system shall support tiered feature availability where modules (Employee, Attendance, Leave, Payroll, PF/ESIC, Onboarding, Expense, Performance, Task, Helpdesk) are enabled/disabled per plan. | Must |

---

### 3.2 Organizations & Multi-Tenant Management

**Primary Actor(s):** Super Admin

*Onboards customer organizations (tenants), assigns them a subscription plan, and governs suspension / reactivation of tenant access.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-02.1 | The system shall allow Super Admin to register a new tenant organization with a unique code, domain, subscription plan, and subscription validity window. | Must |
| FR-02.2 | The system shall allow Super Admin to update, suspend, and reactivate a tenant organization. | Must |
| FR-02.3 | The system shall block creation of new employees once a tenant's active headcount reaches the `max_employees` seat cap of its subscription plan. | Must |
| FR-02.4 | The system shall expose tenant usage metrics (seats used, module usage, API throughput) to the Super Admin. | Should |
| FR-02.5 | Every tenant-owned record shall carry a mandatory `tenant_id` and be protected by a server-side global query filter. | Must — Critical |

---

### 3.3 Authentication & Session Management

**Primary Actor(s):** All Users

*Issues and manages JWT access/refresh tokens, password resets, and active-session visibility.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-03.1 | The system shall authenticate users via email/password and issue a short-lived (15 min) JWT access token plus a 7-day refresh token on successful login. | Must |
| FR-03.2 | The system shall hash passwords using BCrypt (work factor 12) and store only the SHA-256 hash of refresh tokens, bound to a device fingerprint. | Must |
| FR-03.3 | The system shall support token refresh, logout (single session) and logout-all (all devices). | Must |
| FR-03.4 | The system shall support forgot-password, reset-password (via one-time token), and authenticated change-password flows. | Must |
| FR-03.5 | The system shall lock a user account after 5 consecutive failed login attempts. | Must |
| FR-03.6 | The system shall let a user view and revoke their own active login sessions/devices. | Should |
| FR-03.7 | The `/auth/me` endpoint shall return the caller's real database-derived roles, permissions, tenant/company identity, department, and designation — never a hardcoded role set. | Must — Critical Fix |

---

### 3.4 Users & Identity

**Primary Actor(s):** HR/Admin

*Manages login accounts mapped 1:1 to employee records, including role assignment.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-04.1 | The system shall allow authorized admins to provision, update, deactivate, and reactivate user accounts. | Must |
| FR-04.2 | The system shall allow assignment of one or more roles to a user account. | Must |
| FR-04.3 | The system shall allow an authorized admin to force-reset another user's password. | Should |
| FR-04.4 | Every user shall belong to exactly one tenant (`tenant_id`) except the Platform Super Admin account(s). | Must |

---

### 3.5 Roles & Permissions Catalog (PBAC)

**Primary Actor(s):** Super Admin / HR Admin

*Defines the discrete permission catalog (`{module}.{action}` strings) and role-to-permission mappings that drive all authorization checks.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-05.1 | The system shall allow creation, update, deletion, and cloning of roles scoped to a tenant. | Must |
| FR-05.2 | The system shall allow an authorized admin to set the full permission matrix for a role in one operation. | Must |
| FR-05.3 | The system shall expose a read-only catalog of all available permission strings for UI-driven permission assignment. | Must |
| FR-05.4 | Every mutating API endpoint shall be protected by a declarative `[Authorize(Policy="{module}.{action}")]` permission check evaluated server-side. | Must |
| FR-05.5 | Module visibility shall be controlled by role-based permissions, not by hardcoded role checks. | Must |

---

### 3.6 Company Profile & Legal Entities

**Primary Actor(s):** Company Admin

*Maintains statutory identifiers and branding for the tenant's legal company entity.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-06.1 | The system shall allow a Company Admin to view and update company profile fields: legal name, CIN, PAN, TAN, GSTIN, logo, website, and fiscal-year start month. | Must |
| FR-06.2 | The system shall allow upload/replacement of the company logo image. | Should |

---

### 3.7 Branches & Regional Locations

**Primary Actor(s):** Company Admin

*Manages physical/registered work locations, each with geofencing radius and timezone.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-07.1 | The system shall support CRUD operations on branches with address, GPS coordinates, geofence radius (metres), timezone, and head-office flag. | Must |
| FR-07.2 | Branch data queries shall be filterable by `companyId` so a Company Admin only ever sees their own tenant's branches. | Must |
| FR-07.3 | Each branch shall support location-specific holidays, shifts, and payroll configuration. | Should |

---

### 3.8 Departments & Organizational Hierarchy

**Primary Actor(s):** Company Admin

*Maintains a self-referencing department tree with assigned department heads.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-08.1 | The system shall support CRUD operations on departments, including parent-child nesting. | Must |
| FR-08.2 | The system shall allow assignment of an employee as a department head. | Should |
| FR-08.3 | The system shall render a full organization tree/chart on request. | Should |
| FR-08.4 | Departments shall be usable for attendance reports, payroll grouping, and leave approvals. | Must |

---

### 3.9 Designations, Grades & Job Levels

**Primary Actor(s):** HR Admin

*Defines job titles, org levels (L1–L8) and salary compensation bands per department.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-09.1 | The system shall support CRUD operations on designations, each with a level, grade, and min/max salary band. | Must |
| FR-09.2 | Designations shall be usable for organizational reporting and salary structure assignment. | Must |

---

### 3.10 Financial Years & Fiscal Settings

**Primary Actor(s):** Finance/HR Admin

*Defines the fiscal calendar used for tax projection and leave-cycle resets.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-10.1 | The system shall allow configuration and closure of financial years (e.g., 1 Apr – 31 Mar). | Must |
| FR-10.2 | The system shall expose the currently active financial year to all payroll and leave computations. | Must |

---

### 3.11 Holiday Calendars

**Primary Actor(s):** HR Admin

*Configures company-wide and branch-specific mandatory/floating holidays.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-11.1 | The system shall support CRUD and bulk import of holiday calendar entries, scoped to company or a specific branch. | Must |

---

### 3.12 Weekly-Off Configurations

**Primary Actor(s):** HR Admin

*Defines standard weekly-off rules (5-day/6-day week, alternate Saturdays) per branch.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-12.1 | The system shall allow configuration of a weekly-off policy and its assignment to one or more branches. | Must |

---

### 3.13 Employee Master & 360° Profile

**Primary Actor(s):** HR Admin / Employee

*The central record of personal, employment, statutory, and banking data for every employee, plus the ESS self-profile view.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-13.1 | The system shall allow HR to create and update the full employee record (personal, employment, statutory, banking, reporting hierarchy). | Must |
| FR-13.2 | The system shall allow an employee to view their own 360° profile and self-update limited fields (phone, address) via `/employees/me`. | Must |
| FR-13.3 | The system shall encrypt PAN, Aadhaar, and bank account numbers at rest using AES-GCM before persistence. | Must |
| FR-13.4 | The system shall provide organization-chart, employment-history, and direct-reports views for a given employee. | Should |
| FR-13.5 | The system shall support bulk employee import and export (Excel/CSV). | Should |
| FR-13.6 | Employee list/search queries shall accept an optional `companyId` filter and, for non-Super-Admin roles, shall be forced to the caller's own `companyId` regardless of client input. | Must — Critical Fix |
| FR-13.7 | The employee record shall serve as the central repository connecting to all other modules (attendance, leave, payroll, expenses, assets, performance). | Must |

---

### 3.14 Pre-Boarding, Offer Management & E-Sign

**Primary Actor(s):** Recruiter/HR Admin

*Issues digital offer letters and collects pre-joining candidate documents.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-14.1 | The system shall generate a PDF offer letter and deliver it via a secure, time-bound (7-day TTL) link. | Must |
| FR-14.2 | The system shall allow the candidate to accept or decline the offer via an anonymous token-authenticated link. | Must |
| FR-14.3 | The system shall allow HR to resend an offer letter and list all issued offers with status. | Should |
| FR-14.4 | The system shall track document collection status (Aadhaar, PAN, Photo, Education, Bank) during pre-boarding. | Must |

---

### 3.15 Onboarding Checklists & Document Verification

**Primary Actor(s):** HR Admin

*Tracks configurable joining checklist items through completion.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-15.1 | The system shall allow HR to define an onboarding checklist and verify each item (ID card, email, laptop, document checks, policy acceptance, attendance setup). | Must |
| FR-15.2 | The system shall expose a per-employee onboarding status and a list of all pending onboardings. | Should |

---

### 3.16 Employee Lifecycle (Transfers, Promotions, Exit)

**Primary Actor(s):** HR Admin

*Manages department/branch transfers, promotions, resignations, exit clearance, and termination.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-16.1 | The system shall support transfer and promotion actions with full audit history retained on the employee record. | Must |
| FR-16.2 | The system shall support employee-submitted resignation, HR-driven exit clearance workflow, termination, and reactivation of a previously terminated employee. | Must |
| FR-16.3 | Exit clearance shall require asset return acknowledgment before finalization. | Should |

---

### 3.17 Attendance Core & Multi-Device Synchronization

**Primary Actor(s):** Employee / HR Admin

*Captures attendance from biometric terminals, GPS/selfie mobile punches, QR, and web, and reconciles them into a daily record.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-17.1 | The system shall allow an employee to self check-in and check-out via GPS-tagged, optionally selfie-verified, mobile or web punch. | Must |
| FR-17.2 | The system shall accept device-pushed biometric punch logs and bulk-imported punch sheets. | Must |
| FR-17.3 | The system shall compute total working hours, late minutes, early-exit minutes, and overtime minutes per attendance day from raw punches. | Must |
| FR-17.4 | The system shall provide a real-time live-presence dashboard (Present / Absent / On Leave / Late) to HR and managers. | Should |
| FR-17.5 | The system shall provide an employee's own today-status and historical punch log. | Must |
| FR-17.6 | The system shall support multiple attendance capture methods: face recognition, RFID, GPS, QR code, biometric, and web-based punch. | Must |

---

### 3.18 Attendance Policies & Overtime Engine

**Primary Actor(s):** HR Admin / Manager

*Configures grace periods and shift thresholds, and manages the overtime request/approval chain.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-18.1 | The system shall allow configuration of grace-period minutes and half/full-day hour thresholds per shift. | Must |
| FR-18.2 | The system shall allow an employee to submit an OT request and a manager to approve or reject it. | Must |
| FR-18.3 | The system shall generate monthly OT pay registers from approved OT requests. | Should |
| FR-18.4 | OT calculation shall automatically integrate with the payroll engine for OT pay inclusion. | Must |

---

### 3.19 Attendance Regularization & Corrections

**Primary Actor(s):** Employee / Manager / HR Admin

*Allows employees to correct missed or incorrect punches through an approval chain.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-19.1 | The system shall allow an employee to request a punch-time correction with a mandatory reason. | Must |
| FR-19.2 | The system shall route regularization requests through Manager, then optional HR, approval, updating the attendance record status on approval. | Must |
| FR-19.3 | The system shall list all pending regularizations for the current approver. | Must |

---

### 3.20 Shifts & Rotating Rosters

**Primary Actor(s):** HR Admin

*Defines shift masters (standard/afternoon/night) and rotational monthly rosters for factory and office staff.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-20.1 | The system shall support CRUD operations on shift definitions, including midnight-spanning shifts. | Must |
| FR-20.2 | The system shall allow assignment of a monthly rotating roster to employees/branches and support shift-swap requests between employees. | Must |
| FR-20.3 | The system shall render the monthly roster in a viewable grid. | Should |
| FR-20.4 | The system shall support A/B/C shift patterns and weekly-off planning for shift-based businesses. | Must |

---

### 3.21 Leave Types & Accrual Policy Engine

**Primary Actor(s):** HR Admin

*Configures leave categories, annual quotas, accrual cadence, carry-forward caps, and encashment rules.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-21.1 | The system shall support CRUD operations on leave types (CL, PL, SL, Comp-Off, Maternity, Paternity, LWP) with quota, carry-forward, and encashment settings. | Must |
| FR-21.2 | The system shall run a scheduled monthly leave-accrual job that credits balances per the configured policy. | Must |
| FR-21.3 | Leave types shall be configurable per company with specific accrual rules and carry-forward limits. | Must |

---

### 3.22 Leave Requests & Balance Management

**Primary Actor(s):** Employee / Manager / HR Admin

*End-to-end leave application, multi-level approval, and real-time balance ledger.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-22.1 | The system shall allow an employee to submit a leave request (including half-day) with reason and optional document attachment. | Must |
| FR-22.2 | The system shall route leave requests through Manager approval, then HR approval when the duration exceeds the configured threshold (e.g., > 3 days). | Must |
| FR-22.3 | The system shall decrement the employee's leave balance ledger upon final approval and restore it upon cancellation. | Must |
| FR-22.4 | The system shall provide the caller's own real-time leave balance and a team leave calendar view. | Must |
| FR-22.5 | Unauthorized absences (without approved leave) shall automatically be marked as LOP for payroll deduction. | Must |

---

### 3.23 Salary Structures, Payheads & Templates

**Primary Actor(s):** Finance/HR Admin

*Defines reusable earning/deduction payhead components and assigns compensation templates to employees.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-23.1 | The system shall support CRUD operations on payheads with type (Earning/Deduction), category, and calculation method (flat, % of basic, % of gross, formula). | Must |
| FR-23.2 | The system shall allow creation and assignment of a salary structure (CTC breakdown) to an individual employee with an effective-from date. | Must |
| FR-23.3 | Salary structures shall include components: Basic, HRA, Conveyance, Special Allowance, Bonus, Incentive, and other earnings/deductions. | Must |

---

### 3.24 Salary Revisions & Increment History

**Primary Actor(s):** HR Admin / Finance

*Manages compensation change requests and preserves a complete audit trail of historical revisions.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-24.1 | The system shall allow a percentage or flat-amount salary revision with a future or retrospective effective date, subject to approval. | Must |
| FR-24.2 | The system shall retain the full salary revision history per employee, viewable on demand. | Must |
| FR-24.3 | Salary revision workflow shall route through Manager → HR → Finance approval chain. | Should |

---

### 3.25 Loans, Advances & EMI Recovery Engine

**Primary Actor(s):** Employee / HR / Finance

*Manages salary advance/loan applications, approval, disbursement, and automatic EMI deduction in payroll.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-25.1 | The system shall allow an employee to apply for a salary advance or loan, and HR/Finance to approve, reject, or disburse it. | Must |
| FR-25.2 | The system shall generate an amortization schedule and expose it to both the employee and Finance. | Must |
| FR-25.3 | The system shall automatically pull the active monthly EMI of any `Approved`/`Active` loan into the `LOAN_RECOVERY` payroll deduction line for the processing month. | Must |
| FR-25.4 | The system shall support loan foreclosure (early full settlement). | Should |
| FR-25.5 | Loan approval workflow: Employee → HR → Finance. | Must |

---

### 3.26 Expense Claims & Reimbursements

**Primary Actor(s):** Employee / Manager / Finance

*Captures travel/field expense claims with receipt uploads and routes them into payroll as non-taxable reimbursement.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-26.1 | The system shall allow an employee to submit an expense claim with category, amount, and a mandatory receipt image/file. | Must |
| FR-26.2 | The system shall route claims through Manager approval, then Finance approval, before reimbursement eligibility. | Must |
| FR-26.3 | The system shall aggregate all `FinanceApproved` claims into the `EXPENSE_REIMBURSEMENT` non-taxable earnings line of the current payroll cycle. | Must |
| FR-26.4 | Expense reimbursement workflow: Employee → Manager → Finance. | Must |

---

### 3.27 Field Employee Live GPS Tracking & Visit Logs

**Primary Actor(s):** Field Employee / Manager

*Tracks field/sales agent live location and client-visit check-in/out with travel-distance computation.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-27.1 | The system shall accept periodic live GPS location pings from field employees. | Must |
| FR-27.2 | The system shall allow a field employee to check-in and check-out of a client visit with geotagged coordinates, notes, and signature. | Must |
| FR-27.3 | The system shall compute distance travelled (km) per visit and provide travel-allowance reports. | Should |
| FR-27.4 | The system shall provide managers a real-time map of field employee locations. | Should |

---

### 3.28 Payroll Calculation Core & Disbursement

**Primary Actor(s):** Payroll Officer / Finance / HR Director

*Executes the monthly batch payroll run, aggregating attendance, leave, OT, loans, and expenses into net pay, then generates payslips and bank files.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-28.1 | The system shall allow a Payroll Officer to initialize a draft payroll run for a company/branch/month. | Must |
| FR-28.2 | The system shall process the run by computing, per employee: payable days, LOP days, OT hours, gross earnings, statutory deductions, loan recovery, expense reimbursement, and net salary. | Must |
| FR-28.3 | The system shall route the computed run through a configurable multi-level approval chain (HR → Finance → Leadership) before it can be locked. | Must |
| FR-28.4 | The system shall generate individual PDF payslips and a bulk ZIP export, and shall publish payslips to the ESS portal on approval. | Must |
| FR-28.5 | The system shall export a bank-ready NEFT/RTGS disbursement file for an approved run. | Must |
| FR-28.6 | The system shall prevent further edits to a payroll run once it reaches `Locked` status, and shall support a separate off-cycle adjustment run instead. | Must |
| FR-28.7 | The payroll engine shall pull data from: Employee Master, Salary Structure, Attendance, Leave (LOP), OT, Bonus/Incentive, Loan EMI, Expense Reimbursement, Statutory Deductions. | Must |

---

### 3.29 Statutory & Compliance Engine (PF, ESIC, PT, TDS, Gratuity, Bonus)

**Primary Actor(s):** Finance / Compliance Officer

*Automates Indian statutory payroll computations and generates the corresponding government filing exports.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-29.1 | The system shall compute Employee Provident Fund at 12% of (Basic + DA), subject to the statutory wage ceiling, split into EPS (8.33%) and EPF (3.67%) employer contribution plus EDLI/admin charges. | Must |
| FR-29.2 | The system shall compute ESIC at 0.75% (employee) / 3.25% (employer) of gross wages for employees earning ≤ ₹21,000/month. | Must |
| FR-29.3 | The system shall compute Professional Tax per state-specific slab schedules (e.g., Maharashtra, Karnataka, Gujarat, Tamil Nadu, West Bengal). | Must |
| FR-29.4 | The system shall compute monthly TDS based on the employee's declared tax regime (Old vs. New u/s 115BAC), Chapter VI-A deductions, HRA exemption, and annualized projection. | Must |
| FR-29.5 | The system shall allow employees to submit tax-declaration investment proofs and allow Finance to verify them. | Must |
| FR-29.6 | The system shall export EPF ECR (.txt), ESIC monthly return (.csv), PT state return, and Form 16 Part A/B on demand. | Must |
| FR-29.7 | The system shall compute gratuity provisions and statutory bonus (8.33%–20%) per applicable slabs. | Should |

---

### 3.30 Asset Management & Allocation Lifecycle

**Primary Actor(s):** HR Admin / Employee

*Tracks company hardware/software/vehicle inventory from registration through assignment, return, and retirement.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-30.1 | The system shall support registration, update, assignment, return, maintenance logging, and retirement of company assets. | Must |
| FR-30.2 | The system shall require asset return acknowledgment as part of the employee offboarding/exit-clearance process. | Must |
| FR-30.3 | The system shall allow an employee to view their own currently assigned assets. | Must |
| FR-30.4 | Asset types shall include: Laptop, Mobile, Monitor, Vehicle, ID Card, and other equipment. | Should |

---

### 3.31 Task Management & Operational SLAs

**Primary Actor(s):** Manager / Employee

*Operational team task board with priorities, due dates, and status tracking.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-31.1 | The system shall support creation, assignment, status update (ToDo → InProgress → InReview → Completed/Cancelled), and deletion of tasks. | Must |
| FR-31.2 | The system shall provide "My Tasks" and "Team Tasks" filtered views. | Must |

---

### 3.32 Performance Management (OKRs, KPIs & 360° Reviews)

**Primary Actor(s):** Manager / Employee / HR Admin

*Runs quarterly/annual review cycles with goal-setting, self-review, manager review, and finalized ratings.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-32.1 | The system shall allow HR to create review cycles and employees to set weighted OKR/KPI goals within a cycle. | Must |
| FR-32.2 | The system shall allow employees to submit self-reviews and managers to submit manager reviews against the same goal set. | Must |
| FR-32.3 | The system shall allow HR/management to finalize an appraisal rating, closing the cycle for that employee. | Must |

---

### 3.33 Helpdesk & Employee Ticketing

**Primary Actor(s):** Employee / Support Agent

*Internal ticketing for payroll, attendance, IT, and HR-policy queries with SLA-tracked resolution.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-33.1 | The system shall allow any authenticated employee to raise a support ticket with category, priority, and description. | Must |
| FR-33.2 | The system shall allow ticket assignment to a support agent, threaded comments, resolution, and closure. | Must |
| FR-33.3 | The system shall provide the employee a "My Tickets" view and HR/IT a company-wide ticket queue. | Must |
| FR-33.4 | Ticket categories shall include: Payroll, Attendance, IT, HR Policy, and General. | Should |

---

### 3.34 Documents Hub & Compliance Expiry Engine

**Primary Actor(s):** HR Admin / Employee

*Central secure store for company and employee documents with automated expiry alerts (visas, licenses, passports).*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-34.1 | The system shall allow secure upload, metadata update, and download of employee/company documents. | Must |
| FR-34.2 | The system shall surface a list of documents expiring within the next 30 days. | Should |
| FR-34.3 | Employee documents shall include: Aadhaar, PAN, Photo, Education Certificates, Bank Details, and other supporting documents. | Must |

---

### 3.35 Policies & Versioned Digital Acknowledgments

**Primary Actor(s):** HR Admin / Employee

*Publishes versioned company policies and captures mandatory digital employee sign-off.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-35.1 | The system shall allow HR to create a policy and publish successive versions. | Must |
| FR-35.2 | The system shall require and record employee digital acknowledgment of a published policy version. | Must |
| FR-35.3 | The system shall provide HR a compliance report of acknowledgment status across the workforce. | Should |

---

### 3.36 Workora AI Assistant & Dynamic Reports Engine

**Primary Actor(s):** All Users / HR Admin

*Conversational AI assistant for HR self-service Q&A, plus a cross-module dynamic reporting/export engine.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-36.1 | The system shall allow any authenticated user to ask natural-language questions (leave balance, policy lookup, payslip retrieval, attendance summary) and receive an intent-routed answer. | Must |
| FR-36.2 | The system shall provide standard analytical reports: headcount, attrition, payroll cost trend, and leave utilization. | Should |
| FR-36.3 | The system shall provide a dynamic report builder with Excel export for ad-hoc cross-module queries. | Could |
| FR-36.4 | All AI-triggered data retrieval shall respect the same tenant-scoping and permission checks as the equivalent direct API call — the AI assistant is not a bypass path. | Must |
| FR-36.5 | The AI assistant shall support attendance, leave, payroll, policies, documents, and task automation queries with role-based access. | Should |

---

### 3.37 Notifications & Communication Engine

**Primary Actor(s):** System / All Users

*Central notification service for all system events across multiple channels.*

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-37.1 | The system shall send notifications for: Leave Approved/Rejected, Payroll Finalized, Payslip Available, Expense Approved/Rejected, Missed Punch Reminder, Document Expiry Alert, Task Assignment, Ticket Resolution. | Must |
| FR-37.2 | The system shall support notification delivery via: In-App, Email, Push, and SMS. | Should |
| FR-37.3 | The system shall maintain a central notification log per user with read/unread status. | Must |

---

## 4. Functional Requirements — Access Control, Tenancy & Navigation

This section captures the requirements raised by the PBAC/RBAC remediation plan. These are treated as first-class functional requirements because, unlike a missing report or a nice-to-have field, a tenant-isolation gap is a data-breach-class defect.

| FR ID | Requirement Description | Priority |
|---|---|---|
| FR-AC.1 | The `/auth/me` response shall be derived from the authenticated user's actual database roles, permissions, `companyId`, `companyName`, `companyCode`, `departmentName`, `designationTitle`, and `employeeCode` — the previously hardcoded `roles:["SuperAdmin"]` behaviour is a defect and shall be eliminated. | Must — Critical |
| FR-AC.2 | The system shall define exactly three access tiers: Super Admin (Platform), Company Admin/HR/Finance/Manager (Tenant), and Employee (ESS), and every screen and API route shall map unambiguously to at least one tier. | Must |
| FR-AC.3 | A Company Admin, HR user, Finance user, Manager, or Employee shall only ever see and act on data belonging to their own `companyId`; this scoping shall be enforced server-side (query filter), not only hidden in the UI. | Must — Critical |
| FR-AC.4 | Only the designated Global Super Admin account(s) shall have platform-wide visibility across all tenant organizations and access to the SuperAdmin SaaS console. | Must |
| FR-AC.5 | The Super Admin shall be able to switch an active "viewing context" between Global (all tenants) and any single tenant company via a Tenant Context Switcher, without that switch granting write access outside platform-governance functions. | Must |
| FR-AC.6 | Every application route shall be protected by a route guard evaluating one or more of: `requiredPermission`, `requiredAnyPermission`, `requiredRole`, `requiredAnyRole`, or `superAdminOnly`, with Super Admin retaining a documented bypass. | Must |
| FR-AC.7 | A user who attempts direct URL navigation to a route they are not authorized for shall be redirected to their dashboard and shown a clear denial notification; no partial data shall be rendered first. | Must |
| FR-AC.8 | The UI shall provide element-level authorization directives (structural "has permission" / "has role") so that action buttons and admin panels are not rendered at all for unauthorized users, in addition to route-level guards. | Must |
| FR-AC.9 | The primary navigation sidebar shall render dynamically per the caller's tier: Level 1 items (SuperAdmin Console, Platform Users, Global Audit Trail, System Settings, Roles & Permissions) only for Super Admin; Level 2 items (Employees, Org Chart, Attendance Muster, Payroll Runs, Compliance, Assets, Helpdesk, Company Setup) only for Company Admin/HR/Manager tiers; Level 3 ESS items available to all authenticated users. | Must |
| FR-AC.10 | The application topbar shall display an always-visible Company/Tenant identity indicator (company name + short code) and a colour-coded role badge (Super Admin, HR Admin, Manager, Employee). | Should |
| FR-AC.11 | The dashboard landing page shall render a different content set per tier: Super Admin sees platform KPIs (tenant count, global workforce, MRR, active subscriptions, system health); Company Admin/HR sees company-scoped KPIs (headcount, today's attendance rate, payroll status, pending approvals, vacancies); Employee sees a personal punch clock, leave-balance cards, latest payslip, and pending-request status. | Must |
| FR-AC.12 | List and search queries for employees, branches, departments, and payroll runs shall accept the effective tenant scope as a first-class filter parameter, and this parameter shall be forced server-side to the caller's own `companyId` for every role except Super Admin. | Must — Critical |

### 4.1 Navigation Map by Tier

| Tier | Sidebar Sections Visible |
|---|---|
| **Super Admin** | SuperAdmin Console · Platform Users · Global Audit Trail · System Settings · Roles & Permissions · Tenant Context Switcher |
| **Company Admin / HR / Manager** | Dashboard · Organization (Company, Branches, Departments, Designations) · Employee (All Employees, Add Employee, Import, Documents) · Recruitment/Pre-Boarding (Candidates, Offers, Document Collection) · Onboarding (Pending, In Progress, Completed) · Attendance (Live, Daily, Monthly, Late, Early, Absent, Regularization, Geo Tracking) · Shift & Roster (Shift Master, Roster, Weekly Off, Holiday) · Leave (Types, Policies, Balances, Requests, Calendar) · Payroll (Salary Structure, Payheads, Revision, Processing, Approval, Payslips) · Loans & Advances (Requests, Loans, EMI, Recovery) · Overtime (Rules, Requests, Approval, Report) · Expense (Categories, Claims, Approval, Reimbursement) · Compliance (PF, ESIC, PT, TDS, Gratuity, Statutory Reports) · Assets (Master, Allocation, Return, Maintenance) · Visit/Field (Live Tracking, Visits, Routes, Travel Reports) · Performance (Goals, KPI, Reviews, Ratings) · Tasks (My Tasks, Team Tasks) · Helpdesk (Tickets, Categories, SLA) · Documents (HR Templates, Policies, Employee Docs) · Reports (HR, Attendance, Payroll, Leave, Expense, Compliance) · Notifications · AI Assistant · Settings (Roles, Permissions, Workflow, Integrations, Audit Logs) |
| **Employee (ESS)** | Dashboard (Punch Clock, Leave Balance, Latest Payslip) · My Attendance (Today Status, History) · My Leaves (Apply, Balance, History) · My Salary (Current, History, Payslips) · My Expenses (Submit, History) · My Loans (Apply, Status, EMI Schedule) · My Documents (Upload, View) · My Assets (View Assigned) · My Tasks (Assigned, Status) · Helpdesk (My Tickets, New Ticket) · Policies (View, Acknowledge) · AI Assistant · Account Security |

---

## 5. Cross-Cutting Functional Requirement — Multi-Level Approval Engine

Seven workflow types share one configurable state machine (Draft → Pending Manager → [Pending HR/Finance] → Approved/Rejected/Cancelled). Approval is a reusable capability, not a per-module bespoke feature, and shall be implemented once and configured per workflow type.

| Workflow Type | Level 1 Approver | Level 2 Approver | Effect on Approval |
|---|---|---|---|
| Leave Application | Direct Reporting Manager | HR Manager (if > 3 days) | Decrements leave balance; updates attendance sheet |
| Attendance Regularization | Reporting Manager | HR Admin | Updates punch record from Absent/Missed to Present |
| Expense Reimbursement | Project/Dept Manager | Finance Approver | Queues claim into next payroll reimbursement batch |
| Salary Advance / Loan | HR Manager | Finance Director | Generates loan account and monthly EMI deduction schedule |
| Salary Revision / Increment | Department Head | Management / Finance | Updates salary structure with effective-from date |
| Monthly Payroll Batch Run | HR Director | Finance VP / CFO | Locks payroll records, generates immutable payslips, publishes to ESS |
| Candidate Offer Letter | Recruiter | HR Manager | Generates and sends offer letter; creates employee record on acceptance |

- **FR-APPR.1** — The system shall reject any final approval action attempted by a user lacking the permission mapped to that workflow's approver level, even if that user is the record's submitter.
- **FR-APPR.2** — Rejection at any level shall require a mandatory comment and shall notify the submitter.
- **FR-APPR.3** — A submitter shall be able to withdraw/cancel their own request while it remains in a Pending state, restoring any provisionally reserved balance (e.g. leave days).

---

## 6. Data Requirements Summary

The full entity-relationship schema is maintained in the architecture specification (Section 11) and is not reproduced field-by-field here; this section states the governing data rules that every entity must satisfy.

- Every tenant-owned table carries a mandatory `tenant_id` and is protected by an EF Core global query filter comparing it to the caller's resolved tenant context — never trusted from client input alone.
- Every operational record is soft-deleted (`is_deleted`, `deleted_at`, `deleted_by`) and carries full audit columns (`created_at/by`, `updated_at/by`) stamped automatically by a `SaveChangesInterceptor`.
- Optimistic concurrency uses the PostgreSQL `xmin` system column; conflicting concurrent writes surface as `409 Conflict`.
- PII/financial fields (PAN, Aadhaar, bank account number) are encrypted at rest via AES-GCM value converters and never appear in plaintext logs.
- Core entity families:
  - Tenancy: `tenants`, `subscription_plans`
  - Organization: `companies`, `branches`, `departments`, `designations`
  - Workforce: `employees`
  - Time: `shifts`, `attendance_records`, `attendance_punches`, `attendance_regularizations`
  - Leave: `leave_types`, `leave_balances`, `leave_requests`
  - Compensation: `payheads`, `salary_structures`, `salary_structure_items`, `payroll_runs`, `payroll_run_details`
  - Ancillary: `loan_records`, `expense_claims`, `field_visits`, `assets`, `task_items`, `helpdesk_tickets`
  - Governance: `audit_logs`, `notifications`, `policy_acknowledgments`

---

## 7. External Interface Requirements

### 7.1 API Response Contract
Every API response shall be wrapped in a consistent envelope so that clients can handle success, pagination, and errors uniformly:
- Success: `{ success, data, message, errors: null, correlationId }`
- Paginated: `{ success, data: { items, pageNumber, pageSize, totalCount, totalPages }, correlationId }`
- Error: `{ success: false, data: null, message, errors: [{ field, message }], correlationId }`

### 7.2 API Surface
The platform exposes approximately 280+ versioned REST endpoints (`/api/v1/...`) grouped by module — Platform/Plans, Organizations, Auth, Users, Roles & Permissions, Company & Branches, Departments & Designations, Holidays & Weekly-Offs, Employees, Pre-Boarding/Offers, Attendance, Shifts & Rosters, Leave, Salary Structure, Loans, Expenses, Field GPS, Payroll, Statutory Compliance, Assets, Tasks, Performance, Helpdesk, Documents, Policies, AI & Reports, and Audit Logs. The full endpoint-by-endpoint catalog (route, verb, permission policy, description) is maintained as a living artifact alongside the OpenAPI/Swagger specification generated from source — this FRD references it rather than duplicating it, to avoid the two drifting out of sync.

### 7.3 Exception-to-HTTP-Status Mapping

| Exception Type | HTTP Status | Client sees |
|---|---|---|
| Validation failure | 400 Bad Request | Field-level error list |
| Not found | 404 Not Found | Entity-not-found message |
| Forbidden | 403 Forbidden | Access-denied message |
| Business rule violation | 422 Unprocessable | Machine-readable error code + message |
| Concurrency conflict | 409 Conflict | Conflict-detected message |
| Unhandled exception | 500 Server Error | Generic message + correlation ID only |

---

## 8. Non-Functional Requirements

### 8.1 Security — OWASP API Top 10 Mapping

| ID | Risk | Required Mitigation |
|---|---|---|
| NFR-SEC.1 | Broken Object Level Auth (BOLA) | Global EF Core query filter injects `tenant_id` on every query; handlers independently re-verify caller ownership or elevated permission before returning or mutating a record. |
| NFR-SEC.2 | Broken Authentication | Short-lived JWTs (15 min), SHA-256-hashed rotating refresh tokens, 5-attempt account lockout, BCrypt (work factor 12) password hashing. |
| NFR-SEC.3 | Broken Object Property Level Auth | Strict AutoMapper DTO projections; no raw entity or mass-assignable sensitive field (e.g. `is_admin`, `salary`) is ever exposed to a client payload. |
| NFR-SEC.4 | Unrestricted Resource Consumption | Per-IP/user rate limiting, paging capped at 100 records, upload size capped at 10 MB. |
| NFR-SEC.5 | Broken Function Level Auth (BFLA) | Declarative permission-policy attribute on every mutating endpoint, evaluated server-side. |
| NFR-SEC.6 | Unrestricted Access to Sensitive Flows | Payroll execution locking flag, offer-letter 7-day link TTL, step-up verification on bank-detail changes. |
| NFR-SEC.7 | Server-Side Request Forgery | No client-supplied URL is ever fetched by the server; outbound webhook targets are whitelisted. |
| NFR-SEC.8 | Security Misconfiguration | Swagger disabled in production; CORS restricted to configured origins; HSTS / nosniff / frame-deny headers enforced. |
| NFR-SEC.9 | Improper Inventory Management | Clean `/api/v1/` versioning; deprecated endpoints carry a formal `Sunset` header. |
| NFR-SEC.10 | Unsafe Consumption of APIs | Outbound email/SMS/Service-Bus calls use retry-with-backoff and circuit breakers. |

### 8.2 Data, Performance, Availability & Observability

| ID | Category | Requirement |
|---|---|---|
| NFR-DATA.1 | Data Isolation | Multi-tenant data shall use a shared-database/shared-schema model with PostgreSQL Row-Level Security and mandatory EF Core global query filters; zero cross-tenant data leakage is a release-blocking defect class. |
| NFR-DATA.2 | PII Protection | Bank account numbers, IFSC, Aadhaar, and PAN shall be encrypted at rest (AES-GCM) and stripped from all structured logs. |
| NFR-DATA.3 | Auditability | Every create/update/delete/approve/finalize/login action on a governed entity shall write an immutable audit-log entry capturing who, what, when, old/new values, and source IP. |
| NFR-PERF.1 | Payroll Batch Performance | A monthly payroll run for up to 5,000 employees shall complete processing within an operationally acceptable batch window, using distributed locking to prevent concurrent double-runs. |
| NFR-PERF.2 | API Responsiveness | Paginated list endpoints shall return within a defined SLA under normal load; hot reference data (permissions, holidays, settings) shall be served from in-process/distributed cache. |
| NFR-AVAIL.1 | Availability | Core API and database shall run on zone-redundant, autoscaled managed infrastructure with automated point-in-time backup. |
| NFR-CONC.1 | Concurrency Control | Optimistic concurrency (row-version) checks shall surface as `409 Conflict` on simultaneous conflicting edits, rather than silently overwriting. |
| NFR-OBS.1 | Observability | Every request/log entry shall be enriched with Correlation ID, Tenant ID, User ID, and traceable through centralized structured logging and APM. |

---

## 9. Verification & Acceptance Plan

Requirements in this document are considered met only when both automated checks and the manual scenarios below pass.

| ID | Check | Pass Condition |
|---|---|---|
| AC-1 | Build & Test | Backend solution builds cleanly and all unit/integration tests pass; frontend builds and lints cleanly with no type errors. |
| AC-2 | Super Admin login | Login as the Global Super Admin shows the Platform Governance sidebar and Super Admin badge; the SuperAdmin console lists every tenant; the Tenant Switcher correctly filters all downstream screens when a tenant is selected. |
| AC-3 | Company Admin login | Login as a tenant HR Admin shows only that company's name/code and an "HR Admin" badge; the SuperAdmin console is absent from navigation and direct URL access is blocked; employee, branch, and department lists show only that tenant's records. |
| AC-4 | Employee (ESS) login | Login as a standard employee shows only ESS navigation items (My Leaves, My Payslips, Live Clock, Policies, Documents, AI Assistant); all HR/Admin routes are both hidden and blocked on direct navigation; the dashboard shows the personal punch card, leave-quota cards, and latest payslip. |
| AC-5 | Cross-tenant leakage check | Attempting to fetch another tenant's employee, branch, payroll, or document record by ID (as a non-Super-Admin) returns a 403/404, never the record. |
| AC-6 | Payroll pipeline integrity | For a test employee with approved leave, approved OT, an active loan, and a finance-approved expense claim, the processed payroll run correctly reflects LOP reduction, OT pay, loan EMI deduction, and reimbursement earning in the generated payslip. |
| AC-7 | Employee lifecycle flow | A candidate → pre-boarding → onboarding → active employee → transfer → promotion → salary revision → offboarding → exit flow completes with all audit trails intact. |
| AC-8 | Attendance-device integration | Biometric punch logs, GPS punches, and web punches are correctly reconciled into daily attendance records with shift calculation. |

### 9.1 Automated Verification
- Backend: full solution build + complete unit/integration test suite (including Testcontainers-based PostgreSQL integration tests) must pass with zero failures.
- Frontend: production build and lint must complete with zero type errors and zero lint errors.

---

## Appendix A — Requirement Priority Legend

| Priority | Meaning |
|---|---|
| Must | Release-blocking. The platform is not usable/safe without this. |
| Should | Important for a complete, credible enterprise product; may slip one release with explicit sign-off. |
| Could | Valuable enhancement; scheduled opportunistically once Must/Should items are stable. |

## Appendix B — Complete Admin Navigation Reference

The following represents the complete Company Admin/HR navigation structure based on Tankhwa Patra's documented capabilities:

```text
WORKORA ADMIN DASHBOARD
│
├── Dashboard
│   ├── KPIs: Employees, Present, Absent, Leave
│   ├── Payroll Summary
│   ├── Attendance Overview
│   └── Pending Requests
│
├── Organization
│   ├── Company Profile
│   ├── Branches & Locations
│   ├── Departments
│   ├── Designations
│   └── Organization Settings
│
├── Employee
│   ├── All Employees
│   ├── Add Employee
│   ├── Import Employees
│   ├── Employee Documents
│   ├── Employee History
│   └── Employee Lifecycle
│
├── Recruitment / Pre-Boarding
│   ├── Candidates
│   ├── Offers
│   ├── Document Collection
│   └── Joining Checklist
│
├── Onboarding
│   ├── Pending
│   ├── In Progress
│   └── Completed
│
├── Attendance
│   ├── Live Attendance
│   ├── Daily Attendance
│   ├── Monthly Attendance
│   ├── Late Coming
│   ├── Early Going
│   ├── Absent
│   ├── Regularization
│   ├── Geo Tracking
│   └── Device Logs
│
├── Shift & Roster
│   ├── Shift Master
│   ├── Roster Management
│   ├── Weekly Off
│   └── Holiday Calendar
│
├── Leave
│   ├── Leave Types
│   ├── Policies
│   ├── Balances
│   ├── Requests
│   └── Leave Calendar
│
├── Payroll
│   ├── Salary Structure
│   ├── Payheads
│   ├── Salary Revision
│   ├── Payroll Processing
│   ├── Payroll Approval
│   ├── Payslips
│   └── Payroll History
│
├── Loans & Advances
│   ├── Requests
│   ├── Loans
│   ├── EMI Schedule
│   └── Recovery
│
├── Overtime
│   ├── OT Rules
│   ├── OT Requests
│   ├── OT Approval
│   └── OT Report
│
├── Expense
│   ├── Categories
│   ├── Claims
│   ├── Approval
│   ├── Reimbursement
│   └── Reports
│
├── Compliance
│   ├── PF
│   ├── ESIC
│   ├── PT
│   ├── TDS
│   ├── Gratuity
│   └── Statutory Reports
│
├── Assets
│   ├── Asset Master
│   ├── Allocation
│   ├── Return
│   └── Maintenance
│
├── Visit / Field
│   ├── Live Tracking
│   ├── Visits
│   ├── Routes
│   └── Travel Reports
│
├── Performance
│   ├── Goals
│   ├── KPI
│   ├── Reviews
│   └── Ratings
│
├── Tasks
│   ├── My Tasks
│   ├── Team Tasks
│   └── Reports
│
├── Helpdesk
│   ├── Tickets
│   ├── Categories
│   └── SLA
│
├── Documents
│   ├── HR Templates
│   ├── Policies
│   ├── Employee Documents
│   └── Letters
│
├── Reports
│   ├── HR Reports
│   ├── Attendance Reports
│   ├── Payroll Reports
│   ├── Leave Reports
│   ├── Expense Reports
│   └── Compliance Reports
│
├── Notifications
│
├── AI Assistant
│
└── Settings
    ├── Roles
    ├── Permissions
    ├── Workflow
    ├── Integrations
    ├── Audit Logs
    └── System Settings
```

## Appendix C — Open Items Carried Forward for Product Decision

- Whether Company Admin, HR Admin, Finance, and Manager remain four distinct roles with overlapping permission sets, or are consolidated — the module list treats them as distinct actors, but the permission catalog (FR-05.x) should be reviewed to avoid role sprawl.
- Whether the Workora AI assistant (FR-36.x) is permitted to trigger write actions (e.g., "apply leave for me") or is restricted to read-only Q&A in this release — FR-36.4 assumes it inherits normal permission checks either way, but the product scope itself needs an explicit decision.
- Retention policy for `audit_logs` and biometric/GPS location pings, which is not specified in either source document and has direct compliance implications (e.g., data-minimization expectations for employee location tracking).