# Workora Backend API Implementation Plan

This implementation plan outlines the complete roadmap for building all backend modules and API endpoints specified in [TechnicalDocument.md](file:///d:/MyProjects/workora/backend/docs/TechnicalDocument.md), adhering strictly to the architecture, code standards, and patterns established in [CodeStructure.md](file:///d:/MyProjects/workora/backend/docs/CodeStructure.md) and [AGENTS.md](file:///d:/MyProjects/workora/.agents/AGENTS.md).

---

## Architecture & Code Standard Guardrails

1. **Clean Architecture & CQRS**:
   - **Domain Layer (`Workora.Domain`)**: Entities (inheriting `AuditableEntity` or `BaseEntity`), Enums, Domain Events, Domain Exceptions, Repository Interfaces (`IRepository<T>`), Value Objects. Zero external dependencies.
   - **Application Layer (`Workora.Application`)**: CQRS vertical slices (`Features/{Module}/{Commands|Queries}/{UseCase}/`), Validators (`FluentValidation`), DTOs, AutoMapper Profiles, and Application Interfaces. Handlers return `ApiResponse<T>` or `ApiResponse<PagedResponse<T>>`.
   - **Persistence Layer (`Workora.Persistence`)**: `AppDbContext`, EF Core Fluent Configurations (`IEntityTypeConfiguration<T>`), Generic & Specific Repositories (`Persistence/Repositories`), EF Interceptors, Seeders (`PermissionCatalog`).
   - **Infrastructure Layer (`Workora.Infrastructure`)**: File Storage, Email Services, PDF Generators (QuestPDF), Token Service.
   - **API Layer (`Workora.API`)**: Thin controllers in `Controllers/v1/` injecting **only** `IMediator`, using `[Authorize(Policy = "...")]`.
   - **Documentation & Comments**: Full XML doc comments on every class, property, method, command, query, handler, validator, and controller action.

---

## Module Roadmap & Execution Phases

We will execute the implementation across structured phases to respect domain relationships and dependencies:

### Phase 1: Core Organization & Hierarchy Modules
- **1. Companies Module (`9.26`)**:
  - Domain: `Company` entity, `ICompanyRepository`.
  - Persistence: `CompanyConfiguration`, `CompanyRepository`, `AppDbContext.DbSet<Company>`.
  - Application: CQRS commands/queries (`GetCompanyProfile`, `UpdateCompanyProfile`, `UploadCompanyLogo`, `GetCompaniesList`), DTOs, AutoMapper profiles.
  - API: `CompaniesController`.
- **2. Branches Module (`9.27`)**:
  - Domain: `Branch` entity, `IBranchRepository`.
  - Persistence: `BranchConfiguration`, `BranchRepository`, `AppDbContext.DbSet<Branch>`.
  - Application: CQRS (`GetBranchesList`, `GetBranchById`, `CreateBranch`, `UpdateBranch`, `DeleteBranch`), DTOs, Validators.
  - API: `BranchesController`.
- **3. Departments Module (`9.5`)**:
  - Domain: `Department` entity, `IDepartmentRepository`.
  - Persistence: `DepartmentConfiguration`, `DepartmentRepository`, `AppDbContext.DbSet<Department>`.
  - Application: CQRS (`GetDepartmentsList`, `GetDepartmentById`, `CreateDepartment`, `UpdateDepartment`, `DeleteDepartment`, `AssignDepartmentHead`), DTOs, Validators.
  - API: `DepartmentsController`.
- **4. Designations Module (`9.6`)**:
  - Domain: `Designation` entity, `IDesignationRepository`.
  - Persistence: `DesignationConfiguration`, `DesignationRepository`, `AppDbContext.DbSet<Designation>`.
  - Application: CQRS (`GetDesignationsList`, `GetDesignationById`, `CreateDesignation`, `UpdateDesignation`, `DeleteDesignation`), DTOs, Validators.
  - API: `DesignationsController`.

---

### Phase 2: Core Employee Management
- **5. Employees Module (`9.7`)**:
  - Domain: `Employee`, `EmployeeEmploymentHistory`, `EmployeeEmergencyContact`, `EmployeeBankDetail` entities; `EmploymentStatus`, `Gender`, `MaritalStatus` enums; `IEmployeeRepository`.
  - Persistence: EF Configurations for Employee aggregate, `EmployeeRepository`, `AppDbContext.DbSets`.
  - Application:
    - Commands: `CreateEmployee`, `UpdateEmployee`, `TransferEmployee`, `TerminateEmployee`, `ReactivateEmployee`, `UpdateMyProfile`, `UpsertEmergencyContact`, `UpsertBankDetails`.
    - Queries: `GetEmployeesList`, `GetEmployeeById`, `GetMyProfile`, `GetEmployeeOrgChart`, `GetEmploymentHistory`, `GetDirectReports`, `ExportEmployees`.
    - DTOs, Validators, Mapping Profiles.
  - API: `EmployeesController`.

---

### Phase 3: Time, Attendance & Scheduling
- **6. Shifts Module (`9.29`)**:
  - Domain: `Shift`, `EmployeeShiftAssignment` entities, `IShiftRepository`.
  - Application & Persistence: Shift CRUD, assign/unassign shift commands/queries, `ShiftsController`.
- **7. Holidays Module (`9.28`)**:
  - Domain: `Holiday` entity, `HolidayType` enum, `IHolidayRepository`.
  - Application & Persistence: Holiday CRUD & filtering by branch/year, `HolidaysController`.
- **8. Attendance Module (`9.8`)**:
  - Domain: `AttendanceRecord`, `AttendanceCorrection` entities, `AttendanceStatus` enum, `IAttendanceRepository`.
  - Application & Persistence: `CheckIn`, `CheckOut`, `GetAttendanceHistory`, `RequestCorrection`, `ApproveCorrection`, `RejectCorrection`, `GetMonthlySummary`, `GetTodayStatus`, `GetCorrectionsList`, `BulkImportAttendance`, `AttendanceController`.
- **9. Leave Module (`9.9`)**:
  - Domain: `LeaveType`, `LeaveRequest`, `LeaveBalance`, `LeaveApproval` entities, `LeaveRequestStatus` enum, `ILeaveRequestRepository`, `ILeaveBalanceRepository`.
  - Application & Persistence: `SubmitLeaveRequest`, `GetLeaveRequestsList`, `ApproveLeaveRequest`, `RejectLeaveRequest`, `CancelLeaveRequest`, `GetLeaveBalances`, `GetLeaveTypes`, `CreateLeaveType`, `UpdateLeaveType`, `GetLeaveCalendar`, `LeaveController`.

---

### Phase 4: Compensation & Payroll
- **10. Salary Structures & Components Module (`9.11`)**:
  - Domain: `SalaryStructure`, `SalaryComponent`, `SalaryStructureComponent` entities, `SalaryComponentType` enum, `ISalaryStructureRepository`.
  - Application & Persistence: Manage components, revise salary structures, `SalaryStructuresController`, `SalaryComponentsController`.
- **11. Payroll Module (`9.10`)**:
  - Domain: `PayrollRun`, `PayrollRunDetail`, `PayrollEarning`, `PayrollDeduction` entities, `PayrollRunStatus` enum, `IPayrollRunRepository`.
  - Application & Persistence: `GetPayrollRunsList`, `CreatePayrollRun`, `ProcessPayrollRun`, `GetPayrollRunById`, `ApprovePayrollRun`, `DeletePayrollRun`, `CreateAdjustmentRun`, `DownloadPayslipPdf`, `DownloadPayslipsBulkZip`, `ExportPayrollDisbursement`, `PayrollController`.

---

### Phase 5: Recruitment & Talent Acquisition
- **12. Job Postings Module (`9.13`)**: `JobPosting` entity, `JobPostingStatus` enum, `IJobPostingRepository`, CQRS handlers, `JobPostingsController`.
- **13. Candidates Module (`9.14`)**: `Candidate`, `CandidateDocument`, `CandidateNote` entities, `CandidateStage` enum, `ICandidateRepository`, CQRS handlers, `CandidatesController`.
- **14. Interviews Module (`9.15`)**: `Interview`, `InterviewPanelist`, `InterviewFeedback` entities, `InterviewStatus` enum, `IInterviewRepository`, CQRS handlers, `InterviewsController`.
- **15. Offer Letters Module (`9.16`)**: `OfferLetter` entity, `OfferLetterStatus` enum, `IOfferLetterRepository`, CQRS handlers, PDF generation, `OfferLettersController`.
- **16. Recruitment Pipeline Module (`9.12`)**: `RecruitmentPipelineStage` entity, pipeline board view and funnel metrics, `RecruitmentController`.

---

### Phase 6: Talent Development, Performance & Operations
- **17. Performance Module (`9.17`)**: `PerformanceCycle`, `PerformanceGoal`, `PerformanceReview`, `PerformanceReviewFeedback` entities, `IPerformanceReviewRepository`, CQRS handlers, `PerformanceController`.
- **18. Training Module (`9.18`)**: `TrainingProgram`, `TrainingEnrollment` entities, `ITrainingRepository`, CQRS handlers, `TrainingController`.
- **19. Assets Module (`9.19`)**: `Asset`, `AssetAssignment`, `AssetMaintenanceLog` entities, `AssetStatus` enum, `IAssetRepository`, CQRS handlers, `AssetsController`.
- **20. Documents Module (`9.20`)**: `Document` entity, `DocumentCategory` enum, `IDocumentRepository`, file upload/download, expiry alerts, `DocumentsController`.
- **21. Company Policies Module (`9.30`)**: `Policy`, `PolicyVersion`, `PolicyAcknowledgment` entities, `IPolicyRepository`, CQRS handlers, `PoliciesController`.

---

### Phase 7: Administration, Cross-Cutting & Reporting
- **22. Notifications Module (`9.21`)**: `Notification`, `NotificationPreference` entities, `NotificationType` enum, `INotificationRepository`, in-app notifications, mark read, unread counts, `NotificationsController`.
- **23. Settings Module (`9.24`)**: `CompanySetting` entity, `ICompanySettingRepository`, settings & feature flags, `SettingsController`.
- **24. Audit Logs Module (`9.25`)**: `AuditLog` entity, `IAuditLogRepository`, audit trail queries & export, `AuditLogsController`.
- **25. Reports Module (`9.22`)**: CQRS read queries for Headcount, Attrition, Payroll Costs, Leave Utilization, Turnover, and exports, `ReportsController`.
- **26. Dashboard Module (`9.23`)**: CQRS queries for role-aware dashboard summaries and individual widget data, `DashboardController`.

---

### Phase 8: System Wiring, Catalog & Migration
- Update `PermissionCatalog.cs` with all permissions across all 30 modules.
- Update `AuthorizationPolicyExtensions.cs` to support all policies.
- Register all new repositories and services in `Persistence/DependencyInjection.cs` and `Infrastructure/DependencyInjection.cs`.
- Ensure all EF Core mappings are registered in `AppDbContext`.
- Generate EF Core database migrations and verify builds.

---

## Verification Plan

### Automated Build & Compilation
```powershell
dotnet build d:\MyProjects\workora\backend\Workora.sln
```

### Validation & API Surface Checks
- Verify Swagger documentation exposes all endpoints with correct route signatures, request bodies, and XML summaries.
- Validate that all controllers route through `IMediator` and return `ApiResponse<T>` or `ApiResponse<PagedResponse<T>>`.
- Verify entity configurations map to `snake_case` tables and properties cleanly without EF configuration warnings.
