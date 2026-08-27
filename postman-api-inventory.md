# Workora API Inventory & Endpoint Catalog

Total Discovered Endpoints: **271** across **37 Functional Modules** and Platform Infrastructure.

| # | Method | Endpoint | Module | Auth | Policy / Permission | Success | Purpose & DTO Payload |
|---|---|---|---|---|---|---|---|
| 1 | `GET` | `/health` | Health | Public | `None` | `200` | **PostgreSQL and API Health Check** <br>*(DTO: `HealthCheckResult`)* |
| 2 | `POST` | `/api/v1/auth/login` | Authentication | Public | `None` | `200` | **SuperAdmin login obtaining JWT & Refresh tokens** <br>*(DTO: `LoginCommand -> AuthResultDto`)* |
| 3 | `POST` | `/api/v1/auth/login` | Authentication | Public | `None` | `200` | **Tenant HR Admin login** <br>*(DTO: `LoginCommand -> AuthResultDto`)* |
| 4 | `POST` | `/api/v1/auth/login` | Authentication | Public | `None` | `200` | **Employee Self-Service login** <br>*(DTO: `LoginCommand -> AuthResultDto`)* |
| 5 | `POST` | `/api/v1/auth/refresh-token` | Authentication | Public | `None` | `200` | **Rotate expired JWT using valid refresh token** <br>*(DTO: `RefreshTokenCommand -> AuthResultDto`)* |
| 6 | `GET` | `/api/v1/auth/me` | Authentication | Bearer JWT | `auth.me` | `200` | **Get current user profile and claims** <br>*(DTO: `UserProfileDto`)* |
| 7 | `POST` | `/api/v1/auth/change-password` | Authentication | Bearer JWT | `auth.change-password` | `200` | **Change current user password** <br>*(DTO: `ChangePasswordCommand -> ChangePasswordResponseDto`)* |
| 8 | `GET` | `/api/v1/auth/sessions` | Authentication | Bearer JWT | `auth.sessions` | `200` | **List all active login sessions** <br>*(DTO: `IReadOnlyList<UserSessionDto>`)* |
| 9 | `POST` | `/api/v1/auth/forgot-password` | Authentication | Public | `None` | `200` | **Initiate password recovery email** <br>*(DTO: `ForgotPasswordCommand -> ForgotPasswordResponseDto`)* |
| 10 | `POST` | `/api/v1/auth/reset-password` | Authentication | Public | `None` | `200` | **Reset password via recovery token** <br>*(DTO: `ResetPasswordCommand -> ResetPasswordResponseDto`)* |
| 11 | `POST` | `/api/v1/auth/logout` | Authentication | Bearer JWT | `auth.logout` | `200` | **Revoke active refresh token** <br>*(DTO: `LogoutCommand -> LogoutResponseDto`)* |
| 12 | `POST` | `/api/v1/auth/logout-all` | Authentication | Bearer JWT | `auth.logout-all` | `200` | **Revoke all active user sessions** <br>*(DTO: `LogoutAllCommand -> LogoutResponseDto`)* |
| 13 | `GET` | `/api/v1/superadmin/plans` | SuperAdmin | Bearer JWT | `superadmin.access` | `200` | **List SaaS subscription plans** <br>*(DTO: `IReadOnlyList<SubscriptionPlanDto>`)* |
| 14 | `POST` | `/api/v1/superadmin/plans` | SuperAdmin | Bearer JWT | `superadmin.access` | `200` | **Create new SaaS subscription plan** <br>*(DTO: `CreateSubscriptionPlanCommand -> SubscriptionPlanDto`)* |
| 15 | `PUT` | `/api/v1/superadmin/plans/{{planId}}` | SuperAdmin | Bearer JWT | `superadmin.access` | `200` | **Update subscription plan** <br>*(DTO: `UpdateSubscriptionPlanCommand -> SubscriptionPlanDto`)* |
| 16 | `DELETE` | `/api/v1/superadmin/plans/{{planId}}` | SuperAdmin | Bearer JWT | `superadmin.access` | `200` | **Delete subscription plan** <br>*(DTO: `DeleteSubscriptionPlanCommand -> bool`)* |
| 17 | `GET` | `/api/v1/superadmin/organizations` | SuperAdmin | Bearer JWT | `superadmin.access` | `200` | **List tenant organizations with pagination** <br>*(DTO: `GetOrganizationsQuery -> PagedResponse<OrganizationDto>`)* |
| 18 | `POST` | `/api/v1/superadmin/organizations` | SuperAdmin | Bearer JWT | `superadmin.access` | `200` | **Provision & register new tenant organization** <br>*(DTO: `RegisterOrganizationCommand -> OrganizationDto`)* |
| 19 | `GET` | `/api/v1/superadmin/organizations/{{organizationId}}` | SuperAdmin | Bearer JWT | `superadmin.access` | `200` | **Get organization details by ID** <br>*(DTO: `GetOrganizationByIdQuery -> OrganizationDto`)* |
| 20 | `PUT` | `/api/v1/superadmin/organizations/{{organizationId}}` | SuperAdmin | Bearer JWT | `superadmin.access` | `200` | **Update organization profile** <br>*(DTO: `UpdateOrganizationCommand -> OrganizationDto`)* |
| 21 | `PATCH` | `/api/v1/superadmin/organizations/{{organizationId}}/suspend` | SuperAdmin | Bearer JWT | `superadmin.access` | `200` | **Suspend tenant organization** <br>*(DTO: `SuspendOrganizationCommand -> bool`)* |
| 22 | `PATCH` | `/api/v1/superadmin/organizations/{{organizationId}}/reactivate` | SuperAdmin | Bearer JWT | `superadmin.access` | `200` | **Reactivate suspended organization** <br>*(DTO: `ReactivateOrganizationCommand -> bool`)* |
| 23 | `GET` | `/api/v1/superadmin/metrics` | SuperAdmin | Bearer JWT | `superadmin.access` | `200` | **Get SaaS global platform metrics** <br>*(DTO: `GetSuperAdminMetricsQuery -> SuperAdminMetricsDto`)* |
| 24 | `GET` | `/api/v1/users` | Users | Bearer JWT | `users.view` | `200` | **List system users with pagination** <br>*(DTO: `GetUsersListQuery -> PagedResponse<UserDto>`)* |
| 25 | `GET` | `/api/v1/users/me` | Users | Bearer JWT | `auth.me` | `200` | **Get current user account details** <br>*(DTO: `GetMyAccountQuery -> UserDetailDto`)* |
| 26 | `GET` | `/api/v1/users/{{userId}}` | Users | Bearer JWT | `users.view` | `200` | **Get user details by ID** <br>*(DTO: `GetUserByIdQuery -> UserDetailDto`)* |
| 27 | `POST` | `/api/v1/users` | Users | Bearer JWT | `users.create` | `200` | **Create new user account** <br>*(DTO: `CreateUserCommand -> UserDto`)* |
| 28 | `PUT` | `/api/v1/users/{{userId}}` | Users | Bearer JWT | `users.update` | `200` | **Update user account profile** <br>*(DTO: `UpdateUserRequestDto -> UserDto`)* |
| 29 | `PATCH` | `/api/v1/users/{{userId}}/deactivate` | Users | Bearer JWT | `users.deactivate` | `200` | **Deactivate user account** <br>*(DTO: `DeactivateUserCommand -> bool`)* |
| 30 | `PATCH` | `/api/v1/users/{{userId}}/activate` | Users | Bearer JWT | `users.deactivate` | `200` | **Activate user account** <br>*(DTO: `ActivateUserCommand -> bool`)* |
| 31 | `POST` | `/api/v1/users/{{userId}}/roles` | Users | Bearer JWT | `users.assign-roles` | `200` | **Assign roles to user** <br>*(DTO: `AssignRolesDto -> bool`)* |
| 32 | `POST` | `/api/v1/users/{{userId}}/reset-password` | Users | Bearer JWT | `users.manage` | `200` | **Admin reset user password** <br>*(DTO: `AdminResetPasswordRequestDto -> bool`)* |
| 33 | `DELETE` | `/api/v1/users/{{userId}}` | Users | Bearer JWT | `users.delete` | `200` | **Delete user account** <br>*(DTO: `DeleteUserCommand -> bool`)* |
| 34 | `GET` | `/api/v1/roles` | Roles | Bearer JWT | `roles.view` | `200` | **List roles with pagination and permissions** <br>*(DTO: `GetRolesListQuery -> PagedResponse<RoleDto>`)* |
| 35 | `GET` | `/api/v1/roles/{{roleId}}` | Roles | Bearer JWT | `roles.view` | `200` | **Get role details with permission list** <br>*(DTO: `GetRoleByIdQuery -> RoleDetailDto`)* |
| 36 | `POST` | `/api/v1/roles` | Roles | Bearer JWT | `roles.create` | `200` | **Create custom role** <br>*(DTO: `CreateRoleCommand -> RoleDto`)* |
| 37 | `PUT` | `/api/v1/roles/{{roleId}}` | Roles | Bearer JWT | `roles.update` | `200` | **Update role details** <br>*(DTO: `UpdateRoleCommand -> RoleDto`)* |
| 38 | `PUT` | `/api/v1/roles/{{roleId}}/permissions` | Roles | Bearer JWT | `roles.manage-permissions` | `200` | **Set permissions for role** <br>*(DTO: `SetRolePermissionsCommand -> bool`)* |
| 39 | `POST` | `/api/v1/roles/{{roleId}}/clone` | Roles | Bearer JWT | `roles.create` | `200` | **Clone existing role** <br>*(DTO: `CloneRoleCommand -> RoleDto`)* |
| 40 | `DELETE` | `/api/v1/roles/{{roleId}}` | Roles | Bearer JWT | `roles.delete` | `200` | **Delete custom role** <br>*(DTO: `DeleteRoleCommand -> bool`)* |
| 41 | `GET` | `/api/v1/permissions` | Permissions | Bearer JWT | `permissions.view` | `200` | **List all system permissions grouped by module** <br>*(DTO: `GetPermissionsListQuery -> IReadOnlyList<ModulePermissionsDto>`)* |
| 42 | `GET` | `/api/v1/company` | Companies | Bearer JWT | `company.view` | `200` | **Get active company profile** <br>*(DTO: `GetCompanyProfileQuery -> CompanyDto`)* |
| 43 | `PUT` | `/api/v1/company` | Companies | Bearer JWT | `company.manage` | `200` | **Update company profile** <br>*(DTO: `UpdateCompanyProfileCommand -> CompanyDto`)* |
| 44 | `POST` | `/api/v1/company/logo` | Companies | Bearer JWT | `company.manage` | `200` | **Upload company brand logo** <br>*(DTO: `UploadCompanyLogoCommand -> bool`)* |
| 45 | `GET` | `/api/v1/companies` | Companies | Bearer JWT | `company.view` | `200` | **List all visible companies (Multi-Tenant SuperAdmin)** <br>*(DTO: `GetCompaniesListQuery -> IReadOnlyList<CompanyDto>`)* |
| 46 | `GET` | `/api/v1/branches` | Branches | Bearer JWT | `branches.view` | `200` | **List company branch offices** <br>*(DTO: `GetBranchesListQuery -> PagedResponse<BranchDto>`)* |
| 47 | `GET` | `/api/v1/branches/{{branchId}}` | Branches | Bearer JWT | `branches.view` | `200` | **Get branch details by ID** <br>*(DTO: `GetBranchByIdQuery -> BranchDto`)* |
| 48 | `POST` | `/api/v1/branches` | Branches | Bearer JWT | `branches.manage` | `200` | **Create new branch location** <br>*(DTO: `CreateBranchCommand -> BranchDto`)* |
| 49 | `PUT` | `/api/v1/branches/{{branchId}}` | Branches | Bearer JWT | `branches.manage` | `200` | **Update branch location** <br>*(DTO: `UpdateBranchCommand -> BranchDto`)* |
| 50 | `DELETE` | `/api/v1/branches/{{branchId}}` | Branches | Bearer JWT | `branches.manage` | `200` | **Delete branch office** <br>*(DTO: `DeleteBranchCommand -> bool`)* |
| 51 | `GET` | `/api/v1/departments` | Departments | Bearer JWT | `departments.view` | `200` | **List departments with pagination** <br>*(DTO: `GetDepartmentsListQuery -> PagedResponse<DepartmentDto>`)* |
| 52 | `GET` | `/api/v1/departments/{{departmentId}}` | Departments | Bearer JWT | `departments.view` | `200` | **Get department details and designations** <br>*(DTO: `GetDepartmentByIdQuery -> DepartmentDetailDto`)* |
| 53 | `POST` | `/api/v1/departments` | Departments | Bearer JWT | `departments.create` | `200` | **Create department** <br>*(DTO: `CreateDepartmentCommand -> DepartmentDto`)* |
| 54 | `PUT` | `/api/v1/departments/{{departmentId}}` | Departments | Bearer JWT | `departments.update` | `200` | **Update department** <br>*(DTO: `UpdateDepartmentCommand -> DepartmentDto`)* |
| 55 | `PATCH` | `/api/v1/departments/{{departmentId}}/assign-head` | Departments | Bearer JWT | `departments.update` | `200` | **Assign department head / HOD** <br>*(DTO: `AssignDepartmentHeadCommand -> DepartmentDto`)* |
| 56 | `DELETE` | `/api/v1/departments/{{departmentId}}` | Departments | Bearer JWT | `departments.delete` | `200` | **Delete department** <br>*(DTO: `DeleteDepartmentCommand -> bool`)* |
| 57 | `GET` | `/api/v1/designations` | Designations | Bearer JWT | `designations.view` | `200` | **List job designations** <br>*(DTO: `GetDesignationsListQuery -> PagedResponse<DesignationDto>`)* |
| 58 | `GET` | `/api/v1/designations/{{designationId}}` | Designations | Bearer JWT | `designations.view` | `200` | **Get designation by ID** <br>*(DTO: `GetDesignationByIdQuery -> DesignationDto`)* |
| 59 | `POST` | `/api/v1/designations` | Designations | Bearer JWT | `designations.create` | `200` | **Create job designation** <br>*(DTO: `CreateDesignationCommand -> DesignationDto`)* |
| 60 | `PUT` | `/api/v1/designations/{{designationId}}` | Designations | Bearer JWT | `designations.update` | `200` | **Update job designation** <br>*(DTO: `UpdateDesignationCommand -> DesignationDto`)* |
| 61 | `DELETE` | `/api/v1/designations/{{designationId}}` | Designations | Bearer JWT | `designations.delete` | `200` | **Delete job designation** <br>*(DTO: `DeleteDesignationCommand -> bool`)* |
| 62 | `GET` | `/api/v1/employees` | Employees | Bearer JWT | `employees.view` | `200` | **List employees with advanced filtering** <br>*(DTO: `GetEmployeesListQuery -> PagedResponse<EmployeeDto>`)* |
| 63 | `GET` | `/api/v1/employees/me` | Employees | Bearer JWT | `None (Authenticated)` | `200` | **Get current employee profile (Self)** <br>*(DTO: `GetMyEmployeeProfileQuery -> EmployeeDetailDto`)* |
| 64 | `PUT` | `/api/v1/employees/me` | Employees | Bearer JWT | `None (Authenticated)` | `200` | **Update own contact information (Self)** <br>*(DTO: `UpdateMyEmployeeProfileCommand -> EmployeeDetailDto`)* |
| 65 | `GET` | `/api/v1/employees/export` | Employees | Bearer JWT | `employees.view` | `200` | **Export employee directory data** <br>*(DTO: `ExportEmployeesQuery -> IReadOnlyList<EmployeeDto>`)* |
| 66 | `GET` | `/api/v1/employees/{{employeeId}}` | Employees | Bearer JWT | `employees.view` | `200` | **Get full employee profile 360 by ID** <br>*(DTO: `GetEmployeeByIdQuery -> EmployeeDetailDto`)* |
| 67 | `POST` | `/api/v1/employees` | Employees | Bearer JWT | `employees.create` | `200` | **Onboard & create new employee** <br>*(DTO: `CreateEmployeeCommand -> EmployeeDto`)* |
| 68 | `PUT` | `/api/v1/employees/{{employeeId}}` | Employees | Bearer JWT | `employees.update` | `200` | **Update employee profile metadata** <br>*(DTO: `UpdateEmployeeCommand -> EmployeeDto`)* |
| 69 | `PATCH` | `/api/v1/employees/{{employeeId}}/transfer` | Employees | Bearer JWT | `employees.transfer` | `200` | **Transfer employee to branch/department** <br>*(DTO: `TransferEmployeeCommand -> EmployeeDto`)* |
| 70 | `PATCH` | `/api/v1/employees/{{employeeId}}/promote` | Employees | Bearer JWT | `employees.update` | `200` | **Promote employee** <br>*(DTO: `PromoteEmployeeCommand -> EmployeeDto`)* |
| 71 | `PATCH` | `/api/v1/employees/{{employeeId}}/terminate` | Employees | Bearer JWT | `employees.terminate` | `200` | **Terminate employee contract** <br>*(DTO: `TerminateEmployeeCommand -> bool`)* |
| 72 | `PATCH` | `/api/v1/employees/{{employeeId}}/reactivate` | Employees | Bearer JWT | `employees.update` | `200` | **Reactivate / Rehire employee** <br>*(DTO: `ReactivateEmployeeCommand -> EmployeeDto`)* |
| 73 | `GET` | `/api/v1/employees/{{employeeId}}/org-chart` | Employees | Bearer JWT | `employees.view` | `200` | **Get reporting hierarchy org chart tree** <br>*(DTO: `GetEmployeeOrgChartQuery -> OrgChartNodeDto`)* |
| 74 | `GET` | `/api/v1/employees/{{employeeId}}/employment-history` | Employees | Bearer JWT | `employees.view` | `200` | **Get career employment history & transitions** <br>*(DTO: `GetEmployeeEmploymentHistoryQuery -> IReadOnlyList<EmploymentHistoryDto>`)* |
| 75 | `GET` | `/api/v1/employees/{{employeeId}}/direct-reports` | Employees | Bearer JWT | `employees.view` | `200` | **List direct subordinate reports** <br>*(DTO: `GetEmployeeDirectReportsQuery -> IReadOnlyList<EmployeeDto>`)* |
| 76 | `POST` | `/api/v1/employees/{{employeeId}}/emergency-contacts` | Employees | Bearer JWT | `employees.update` | `200` | **Add emergency contact** <br>*(DTO: `UpsertEmergencyContactCommand -> bool`)* |
| 77 | `PUT` | `/api/v1/employees/{{employeeId}}/bank-details` | Employees | Bearer JWT | `employees.update` | `200` | **Upsert bank disbursement & statutory IDs** <br>*(DTO: `UpsertBankDetailsCommand -> bool`)* |
| 78 | `POST` | `/api/v1/employees/bulk-import` | Employees | Bearer JWT | `employees.create` | `200` | **Bulk import employees** <br>*(DTO: `BulkImportEmployeesCommand -> int`)* |
| 79 | `GET` | `/api/v1/shifts` | Shifts | Bearer JWT | `shifts.view` | `200` | **List configured shifts** <br>*(DTO: `GetShiftsListQuery -> PagedResponse<ShiftDto>`)* |
| 80 | `GET` | `/api/v1/shifts/{{shiftId}}` | Shifts | Bearer JWT | `shifts.view` | `200` | **Get shift by ID** <br>*(DTO: `GetShiftByIdQuery -> ShiftDto`)* |
| 81 | `POST` | `/api/v1/shifts` | Shifts | Bearer JWT | `shifts.manage` | `200` | **Create shift definition** <br>*(DTO: `CreateShiftCommand -> ShiftDto`)* |
| 82 | `PUT` | `/api/v1/shifts/{{shiftId}}` | Shifts | Bearer JWT | `shifts.manage` | `200` | **Update shift definition** <br>*(DTO: `UpdateShiftCommand -> ShiftDto`)* |
| 83 | `DELETE` | `/api/v1/shifts/{{shiftId}}` | Shifts | Bearer JWT | `shifts.manage` | `200` | **Delete shift** <br>*(DTO: `DeleteShiftCommand -> bool`)* |
| 84 | `POST` | `/api/v1/shifts/assign` | Shifts | Bearer JWT | `shifts.manage` | `200` | **Assign shift to employee** <br>*(DTO: `AssignShiftCommand -> bool`)* |
| 85 | `POST` | `/api/v1/shifts/unassign` | Shifts | Bearer JWT | `shifts.manage` | `200` | **Unassign shift from employee** <br>*(DTO: `UnassignShiftCommand -> bool`)* |
| 86 | `GET` | `/api/v1/shifts/roster` | Shifts | Bearer JWT | `shifts.view` | `200` | **Get monthly shift roster matrix** <br>*(DTO: `GetMonthlyShiftRosterQuery -> IReadOnlyList<EmployeeRosterDto>`)* |
| 87 | `POST` | `/api/v1/shifts/roster/assign` | Shifts | Bearer JWT | `shifts.manage` | `200` | **Assign rotational roster pattern** <br>*(DTO: `AssignRotationalRosterCommand -> bool`)* |
| 88 | `POST` | `/api/v1/shifts/roster/swap` | Shifts | Bearer JWT | `shifts.manage` | `200` | **Swap shifts between employees** <br>*(DTO: `SwapEmployeeShiftsCommand -> bool`)* |
| 89 | `GET` | `/api/v1/holidays` | Holidays | Bearer JWT | `holidays.view` | `200` | **Get annual holiday calendar** <br>*(DTO: `GetHolidaysListQuery -> IReadOnlyList<HolidayDto>`)* |
| 90 | `GET` | `/api/v1/holidays/{{holidayId}}` | Holidays | Bearer JWT | `holidays.view` | `200` | **Get holiday details by ID** <br>*(DTO: `GetHolidayByIdQuery -> HolidayDto`)* |
| 91 | `POST` | `/api/v1/holidays` | Holidays | Bearer JWT | `holidays.manage` | `200` | **Create holiday** <br>*(DTO: `CreateHolidayCommand -> HolidayDto`)* |
| 92 | `PUT` | `/api/v1/holidays/{{holidayId}}` | Holidays | Bearer JWT | `holidays.manage` | `200` | **Update holiday** <br>*(DTO: `UpdateHolidayCommand -> HolidayDto`)* |
| 93 | `DELETE` | `/api/v1/holidays/{{holidayId}}` | Holidays | Bearer JWT | `holidays.manage` | `200` | **Delete holiday** <br>*(DTO: `DeleteHolidayCommand -> bool`)* |
| 94 | `POST` | `/api/v1/holidays/import` | Holidays | Bearer JWT | `holidays.manage` | `200` | **Bulk import annual holidays** <br>*(DTO: `BulkImportHolidaysCommand -> int`)* |
| 95 | `GET` | `/api/v1/weekly-offs` | Holidays | Bearer JWT | `settings.view` | `200` | **Get company weekly-off policy** <br>*(DTO: `GetWeeklyOffPolicyQuery -> WeeklyOffPolicyDto`)* |
| 96 | `PUT` | `/api/v1/weekly-offs` | Holidays | Bearer JWT | `settings.manage` | `200` | **Update company weekly-off policy** <br>*(DTO: `UpdateWeeklyOffPolicyCommand -> WeeklyOffPolicyDto`)* |
| 97 | `POST` | `/api/v1/attendance/check-in` | Attendance | Bearer JWT | `attendance.self` | `200` | **Clock-In / Punch-In for today** <br>*(DTO: `CheckInCommand -> AttendanceRecordDto`)* |
| 98 | `POST` | `/api/v1/attendance/check-out` | Attendance | Bearer JWT | `attendance.self` | `200` | **Clock-Out / Punch-Out for today** <br>*(DTO: `CheckOutCommand -> AttendanceRecordDto`)* |
| 99 | `GET` | `/api/v1/attendance/today` | Attendance | Bearer JWT | `attendance.self` | `200` | **Get today attendance punch status** <br>*(DTO: `GetTodayAttendanceStatusQuery -> AttendanceRecordDto?`)* |
| 100 | `GET` | `/api/v1/attendance/{{employeeId}}` | Attendance | Bearer JWT | `attendance.view` | `200` | **Get attendance history for employee** <br>*(DTO: `GetAttendanceHistoryQuery -> IReadOnlyList<AttendanceRecordDto>`)* |
| 101 | `GET` | `/api/v1/attendance/summary` | Attendance | Bearer JWT | `attendance.view` | `200` | **Get monthly attendance KPI summary** <br>*(DTO: `GetAttendanceSummaryQuery -> AttendanceSummaryDto`)* |
| 102 | `POST` | `/api/v1/attendance/{{attendanceRecordId}}/correction` | Attendance | Bearer JWT | `attendance.self` | `200` | **Submit attendance regularization request** <br>*(DTO: `RequestAttendanceCorrectionCommand -> bool`)* |
| 103 | `GET` | `/api/v1/attendance/corrections` | Attendance | Bearer JWT | `attendance.view` | `200` | **List pending attendance corrections** <br>*(DTO: `GetAttendanceCorrectionsListQuery -> PagedResponse<AttendanceCorrectionDto>`)* |
| 104 | `PATCH` | `/api/v1/attendance/corrections/{{correctionId}}/approve` | Attendance | Bearer JWT | `attendance.approve` | `200` | **Approve attendance correction** <br>*(DTO: `ApproveAttendanceCorrectionCommand -> bool`)* |
| 105 | `PATCH` | `/api/v1/attendance/corrections/{{correctionId}}/reject` | Attendance | Bearer JWT | `attendance.approve` | `200` | **Reject attendance correction** <br>*(DTO: `RejectAttendanceCorrectionCommand -> bool`)* |
| 106 | `POST` | `/api/v1/attendance/bulk-import` | Attendance | Bearer JWT | `attendance.manage` | `200` | **Bulk import daily attendance punches** <br>*(DTO: `BulkImportAttendanceCommand -> int`)* |
| 107 | `GET` | `/api/v1/attendance/live-status` | Attendance | Bearer JWT | `attendance.view` | `200` | **Get live real-time presence dashboard** <br>*(DTO: `GetLiveAttendanceStatusQuery -> LiveAttendanceStatusDto`)* |
| 108 | `POST` | `/api/v1/attendance/device-punches` | Attendance | Bearer JWT | `attendance.manage` | `200` | **Push biometric hardware punch logs** <br>*(DTO: `PushBiometricDevicePunchesCommand -> int`)* |
| 109 | `POST` | `/api/v1/leave/requests` | Leave | Bearer JWT | `leave.apply` | `200` | **Submit leave request application** <br>*(DTO: `ApplyLeaveCommand -> LeaveRequestDto`)* |
| 110 | `GET` | `/api/v1/leave/requests` | Leave | Bearer JWT | `leave.view` | `200` | **List leave requests with status filters** <br>*(DTO: `GetLeaveRequestsListQuery -> PagedResponse<LeaveRequestDto>`)* |
| 111 | `PATCH` | `/api/v1/leave/requests/{{leaveRequestId}}/approve` | Leave | Bearer JWT | `leave.approve` | `200` | **Approve leave request** <br>*(DTO: `ApproveLeaveCommand -> LeaveRequestDto`)* |
| 112 | `PATCH` | `/api/v1/leave/requests/{{leaveRequestId}}/reject` | Leave | Bearer JWT | `leave.approve` | `200` | **Reject leave request** <br>*(DTO: `RejectLeaveCommand -> LeaveRequestDto`)* |
| 113 | `PATCH` | `/api/v1/leave/requests/{{leaveRequestId}}/cancel` | Leave | Bearer JWT | `leave.apply` | `200` | **Cancel leave request (Employee)** <br>*(DTO: `CancelLeaveCommand -> LeaveRequestDto`)* |
| 114 | `GET` | `/api/v1/leave/balances/{{employeeId}}` | Leave | Bearer JWT | `leave.view` | `200` | **Get employee annual leave quotas & balances** <br>*(DTO: `GetLeaveBalancesQuery -> IReadOnlyList<LeaveBalanceDto>`)* |
| 115 | `GET` | `/api/v1/leave/balances/me` | Leave | Bearer JWT | `None (Authenticated)` | `200` | **Get own leave balances (Self)** <br>*(DTO: `GetMyLeaveBalancesQuery -> IReadOnlyList<LeaveBalanceDto>`)* |
| 116 | `GET` | `/api/v1/leave/types` | Leave | Bearer JWT | `leave.view` | `200` | **List configured leave policy types** <br>*(DTO: `GetLeaveTypesListQuery -> IReadOnlyList<LeaveTypeDto>`)* |
| 117 | `POST` | `/api/v1/leave/types` | Leave | Bearer JWT | `leave.manage` | `200` | **Create leave type policy** <br>*(DTO: `CreateLeaveTypeCommand -> LeaveTypeDto`)* |
| 118 | `PUT` | `/api/v1/leave/types/{{leaveTypeId}}` | Leave | Bearer JWT | `leave.manage` | `200` | **Update leave type policy** <br>*(DTO: `UpdateLeaveTypeCommand -> LeaveTypeDto`)* |
| 119 | `GET` | `/api/v1/leave/calendar` | Leave | Bearer JWT | `leave.view` | `200` | **Get team leave schedule calendar** <br>*(DTO: `GetLeaveCalendarQuery -> IReadOnlyList<LeaveCalendarItemDto>`)* |
| 120 | `GET` | `/api/v1/payheads` | Payroll | Bearer JWT | `salary.view` | `200` | **List salary payheads / components** <br>*(DTO: `GetPayheadsListQuery -> IReadOnlyList<PayheadDto>`)* |
| 121 | `POST` | `/api/v1/payheads` | Payroll | Bearer JWT | `salary.manage` | `200` | **Create salary payhead component** <br>*(DTO: `CreatePayheadCommand -> PayheadDto`)* |
| 122 | `PUT` | `/api/v1/payheads/{{payheadId}}` | Payroll | Bearer JWT | `salary.manage` | `200` | **Update salary payhead component** <br>*(DTO: `UpdatePayheadCommand -> PayheadDto`)* |
| 123 | `GET` | `/api/v1/payroll/structures` | Payroll | Bearer JWT | `payroll.manage` | `200` | **List salary structure templates** <br>*(DTO: `GetSalaryStructuresListQuery -> IReadOnlyList<SalaryStructureDto>`)* |
| 124 | `GET` | `/api/v1/payroll/structures/{{salaryStructureId}}` | Payroll | Bearer JWT | `payroll.manage` | `200` | **Get salary structure template by ID** <br>*(DTO: `GetSalaryStructureByIdQuery -> SalaryStructureDto`)* |
| 125 | `POST` | `/api/v1/payroll/structures` | Payroll | Bearer JWT | `payroll.manage` | `200` | **Create salary structure template** <br>*(DTO: `CreateSalaryStructureCommand -> SalaryStructureDto`)* |
| 126 | `PUT` | `/api/v1/payroll/structures/{{salaryStructureId}}` | Payroll | Bearer JWT | `payroll.manage` | `200` | **Update salary structure template** <br>*(DTO: `UpdateSalaryStructureCommand -> SalaryStructureDto`)* |
| 127 | `POST` | `/api/v1/payroll/assign-structure` | Payroll | Bearer JWT | `payroll.manage` | `200` | **Assign salary structure to employee** <br>*(DTO: `AssignSalaryStructureCommand -> bool`)* |
| 128 | `GET` | `/api/v1/payroll/employee-structure/{{employeeId}}` | Payroll | Bearer JWT | `payroll.view` | `200` | **Get current active salary assignment for employee** <br>*(DTO: `GetEmployeeSalaryStructureQuery -> EmployeeSalaryAssignmentDto`)* |
| 129 | `GET` | `/api/v1/payroll/structures/history/{{employeeId}}` | Payroll | Bearer JWT | `payroll.view` | `200` | **Get employee salary revision history** <br>*(DTO: `GetSalaryStructureHistoryQuery -> IReadOnlyList<EmployeeSalaryAssignmentDto>`)* |
| 130 | `GET` | `/api/v1/payroll/runs` | Payroll | Bearer JWT | `payroll.view` | `200` | **List monthly payroll cycles** <br>*(DTO: `GetPayrollRunsListQuery -> PagedResponse<PayrollRunDto>`)* |
| 131 | `POST` | `/api/v1/payroll/runs` | Payroll | Bearer JWT | `payroll.manage` | `200` | **Initialize new monthly payroll run** <br>*(DTO: `CreatePayrollRunCommand -> PayrollRunDetailDto`)* |
| 132 | `GET` | `/api/v1/payroll/runs/{{payrollRunId}}` | Payroll | Bearer JWT | `payroll.view` | `200` | **Get payroll run details & summary** <br>*(DTO: `GetPayrollRunByIdQuery -> PayrollRunDetailDto`)* |
| 133 | `POST` | `/api/v1/payroll/runs/{{payrollRunId}}/process` | Payroll | Bearer JWT | `payroll.process` | `200` | **Process & compute monthly payroll calculations** <br>*(DTO: `ProcessPayrollRunCommand -> PayrollRunDto`)* |
| 134 | `POST` | `/api/v1/payroll/runs/{{payrollRunId}}/approve` | Payroll | Bearer JWT | `payroll.approve` | `200` | **Approve & lock payroll run** <br>*(DTO: `ApprovePayrollRunCommand -> PayrollRunDto`)* |
| 135 | `POST` | `/api/v1/payroll/runs/{{payrollRunId}}/disburse` | Payroll | Bearer JWT | `payroll.disburse` | `200` | **Disburse payroll and publish payslips** <br>*(DTO: `DisbursePayrollRunCommand -> PayrollRunDto`)* |
| 136 | `GET` | `/api/v1/payroll/payslips/{{payslipId}}` | Payroll | Bearer JWT | `payroll.view` | `200` | **Get single payslip breakdown by ID** <br>*(DTO: `GetPayslipByIdQuery -> PayslipDto`)* |
| 137 | `GET` | `/api/v1/payroll/my-payslips` | Payroll | Bearer JWT | `payroll.self` | `200` | **Get own payslips (Self)** <br>*(DTO: `GetMyPayslipsQuery -> IReadOnlyList<PayslipDto>`)* |
| 138 | `GET` | `/api/v1/payroll/runs/{{payrollRunId}}/payslips/{{employeeId}}` | Payroll | Bearer JWT | `payroll.view` | `200` | **Get employee payslip for payroll run** <br>*(DTO: `GetEmployeePayslipQuery -> PayslipDto`)* |
| 139 | `GET` | `/api/v1/payroll/runs/{{payrollRunId}}/payslips/bulk` | Payroll | Bearer JWT | `payroll.view` | `200` | **Download bulk payslips zip archive** <br>*(DTO: `GetBulkPayslipsExportQuery -> BulkPayslipsExportDto`)* |
| 140 | `GET` | `/api/v1/payroll/runs/{{payrollRunId}}/disbursement` | Payroll | Bearer JWT | `payroll.export` | `200` | **Export bank disbursement NEFT/RTGS file** <br>*(DTO: `GetPayrollDisbursementFileQuery -> PayrollDisbursementFileDto`)* |
| 141 | `GET` | `/api/v1/compliance/summary` | Compliance | Bearer JWT | `compliance.view` | `200` | **Get monthly statutory deduction summary (PF, ESIC, PT, TDS)** <br>*(DTO: `GetStatutorySummaryQuery -> StatutorySummaryDto`)* |
| 142 | `GET` | `/api/v1/compliance/epf/ecr` | Compliance | Bearer JWT | `compliance.export` | `200` | **Generate EPF Unified Portal ECR filing text file** <br>*(DTO: `ExportEpfEcrQuery -> StatutoryExportFileDto`)* |
| 143 | `GET` | `/api/v1/compliance/esic/monthly-return` | Compliance | Bearer JWT | `compliance.export` | `200` | **Generate ESIC monthly contribution return file** <br>*(DTO: `ExportEsicMonthlyReturnQuery -> StatutoryExportFileDto`)* |
| 144 | `GET` | `/api/v1/compliance/pt/return` | Compliance | Bearer JWT | `compliance.export` | `200` | **Generate State Professional Tax (PT) return file** <br>*(DTO: `ExportPtReturnQuery -> StatutoryExportFileDto`)* |
| 145 | `POST` | `/api/v1/compliance/tax-declaration` | Compliance | Bearer JWT | `None (Authenticated)` | `200` | **Submit Indian Income Tax 80C/80D/HRA declarations** <br>*(DTO: `DeclareTaxInvestmentCommand -> TaxDeclarationDto`)* |
| 146 | `GET` | `/api/v1/compliance/tds/form16/{{employeeId}}` | Compliance | Bearer JWT | `compliance.view` | `200` | **Generate Form 16 Part A/B Certificate PDF** <br>*(DTO: `GenerateForm16Query -> StatutoryExportFileDto`)* |
| 147 | `GET` | `/api/v1/loans` | Loans | Bearer JWT | `loans.view` | `200` | **List company employee loans and salary advances** <br>*(DTO: `ListCompanyLoansQuery -> List<LoanDto>`)* |
| 148 | `GET` | `/api/v1/loans/me` | Loans | Bearer JWT | `None (Authenticated)` | `200` | **Get own active & past loans (Self)** <br>*(DTO: `ListMyLoansQuery -> List<LoanDto>`)* |
| 149 | `GET` | `/api/v1/loans/{{loanId}}` | Loans | Bearer JWT | `loans.view` | `200` | **Get loan details by ID** <br>*(DTO: `GetLoanByIdQuery -> LoanDto`)* |
| 150 | `GET` | `/api/v1/loans/{{loanId}}/schedule` | Loans | Bearer JWT | `loans.view` | `200` | **Get monthly EMI amortization schedule** <br>*(DTO: `GetLoanEmiScheduleQuery -> List<LoanEmiScheduleDto>`)* |
| 151 | `POST` | `/api/v1/loans/apply` | Loans | Bearer JWT | `loans.apply` | `200` | **Apply for loan or salary advance** <br>*(DTO: `ApplyForLoanCommand -> LoanDto`)* |
| 152 | `PATCH` | `/api/v1/loans/{{loanId}}/approve` | Loans | Bearer JWT | `loans.approve` | `200` | **Approve loan & activate EMI schedule** <br>*(DTO: `ApproveLoanCommand -> LoanDto`)* |
| 153 | `PATCH` | `/api/v1/loans/{{loanId}}/reject` | Loans | Bearer JWT | `loans.approve` | `200` | **Reject loan application** <br>*(DTO: `RejectLoanCommand -> LoanDto`)* |
| 154 | `GET` | `/api/v1/expenses` | Expenses | Bearer JWT | `expenses.view` | `200` | **List company expense reimbursement claims** <br>*(DTO: `ListExpenseClaimsQuery -> List<ExpenseClaimDto>`)* |
| 155 | `GET` | `/api/v1/expenses/me` | Expenses | Bearer JWT | `None (Authenticated)` | `200` | **Get own submitted expense claims (Self)** <br>*(DTO: `ListMyExpensesQuery -> List<ExpenseClaimDto>`)* |
| 156 | `GET` | `/api/v1/expenses/{{expenseClaimId}}` | Expenses | Bearer JWT | `expenses.view` | `200` | **Get expense claim by ID** <br>*(DTO: `GetExpenseClaimByIdQuery -> ExpenseClaimDto`)* |
| 157 | `POST` | `/api/v1/expenses` | Expenses | Bearer JWT | `expenses.submit` | `200` | **Submit new expense reimbursement claim** <br>*(DTO: `SubmitExpenseClaimCommand -> ExpenseClaimDto`)* |
| 158 | `PATCH` | `/api/v1/expenses/{{expenseClaimId}}/approve-manager` | Expenses | Bearer JWT | `expenses.approve` | `200` | **Tier-1 Manager approval of expense claim** <br>*(DTO: `ApproveExpenseClaimCommand -> ExpenseClaimDto`)* |
| 159 | `PATCH` | `/api/v1/expenses/{{expenseClaimId}}/approve-finance` | Expenses | Bearer JWT | `expenses.finance` | `200` | **Tier-2 Finance approval for payout reimbursement** <br>*(DTO: `ApproveExpenseClaimCommand -> ExpenseClaimDto`)* |
| 160 | `PATCH` | `/api/v1/expenses/{{expenseClaimId}}/reject` | Expenses | Bearer JWT | `expenses.approve` | `200` | **Reject expense claim** <br>*(DTO: `RejectExpenseClaimCommand -> ExpenseClaimDto`)* |
| 161 | `POST` | `/api/v1/overtime` | Overtime | Bearer JWT | `overtime.create` | `200` | **Submit overtime request** <br>*(DTO: `CreateOvertimeRequestCommand -> OvertimeRequestDto`)* |
| 162 | `GET` | `/api/v1/overtime` | Overtime | Bearer JWT | `overtime.view` | `200` | **List overtime requests with filters** <br>*(DTO: `GetOvertimeRequestsListQuery -> PagedResponse<OvertimeRequestDto>`)* |
| 163 | `GET` | `/api/v1/overtime/report` | Overtime | Bearer JWT | `overtime.view` | `200` | **Get employee overtime analytics report** <br>*(DTO: `GetOvertimeReportQuery -> OvertimeReportDto`)* |
| 164 | `PATCH` | `/api/v1/overtime/{{overtimeId}}/approve` | Overtime | Bearer JWT | `overtime.approve` | `200` | **Approve overtime request** <br>*(DTO: `ApproveOvertimeRequestCommand -> OvertimeRequestDto`)* |
| 165 | `PATCH` | `/api/v1/overtime/{{overtimeId}}/reject` | Overtime | Bearer JWT | `overtime.approve` | `200` | **Reject overtime request** <br>*(DTO: `RejectOvertimeRequestCommand -> OvertimeRequestDto`)* |
| 166 | `PATCH` | `/api/v1/overtime/{{overtimeId}}/cancel` | Overtime | Bearer JWT | `overtime.self` | `200` | **Cancel overtime request (Self)** <br>*(DTO: `CancelOvertimeRequestCommand -> OvertimeRequestDto`)* |
| 167 | `GET` | `/api/v1/field/locations` | FieldTracking | Bearer JWT | `field.view` | `200` | **Get live real-time GPS locations of field workforce** <br>*(DTO: `GetFieldLiveLocationsQuery -> List<LiveLocationDto>`)* |
| 168 | `GET` | `/api/v1/field/visits/history/{{employeeId}}` | FieldTracking | Bearer JWT | `field.view` | `200` | **Get client visit history for field agent** <br>*(DTO: `GetEmployeeVisitHistoryQuery -> List<FieldVisitDto>`)* |
| 169 | `GET` | `/api/v1/field/reports/travel-km/{{employeeId}}` | FieldTracking | Bearer JWT | `field.view` | `200` | **Get field travel distance & mileage analytics** <br>*(DTO: `GetTravelDistanceReportQuery -> TravelDistanceSummaryDto`)* |
| 170 | `POST` | `/api/v1/field/ping-location` | FieldTracking | Bearer JWT | `field.track` | `200` | **Record background mobile GPS telemetry ping** <br>*(DTO: `RecordLiveGpsPingCommand -> bool`)* |
| 171 | `POST` | `/api/v1/field/visits/check-in` | FieldTracking | Bearer JWT | `field.track` | `200` | **Check-in at client site location** <br>*(DTO: `CheckInClientVisitCommand -> FieldVisitDto`)* |
| 172 | `POST` | `/api/v1/field/visits/check-out` | FieldTracking | Bearer JWT | `field.track` | `200` | **Check-out from client site location** <br>*(DTO: `CheckOutClientVisitCommand -> FieldVisitDto`)* |
| 173 | `GET` | `/api/v1/assets` | Assets | Bearer JWT | `assets.view` | `200` | **List company hardware and equipment assets** <br>*(DTO: `GetAssetsListQuery -> PagedResponse<AssetDto>`)* |
| 174 | `GET` | `/api/v1/assets/{{assetId}}` | Assets | Bearer JWT | `assets.view` | `200` | **Get asset details by ID** <br>*(DTO: `GetAssetByIdQuery -> AssetDto`)* |
| 175 | `POST` | `/api/v1/assets` | Assets | Bearer JWT | `assets.manage` | `200` | **Register new asset in inventory** <br>*(DTO: `CreateAssetCommand -> AssetDto`)* |
| 176 | `PUT` | `/api/v1/assets/{{assetId}}` | Assets | Bearer JWT | `assets.manage` | `200` | **Update asset metadata** <br>*(DTO: `UpdateAssetCommand -> AssetDto`)* |
| 177 | `POST` | `/api/v1/assets/assign` | Assets | Bearer JWT | `assets.manage` | `200` | **Assign / Check out asset to employee** <br>*(DTO: `AssignAssetCommand -> bool`)* |
| 178 | `POST` | `/api/v1/assets/return` | Assets | Bearer JWT | `assets.manage` | `200` | **Return asset back to inventory** <br>*(DTO: `ReturnAssetCommand -> bool`)* |
| 179 | `GET` | `/api/v1/assets/me` | Assets | Bearer JWT | `None (Authenticated)` | `200` | **Get own checked out assets (Self)** <br>*(DTO: `GetMyAssignedAssetsQuery -> IReadOnlyList<AssetDto>`)* |
| 180 | `GET` | `/api/v1/tasks` | Tasks | Bearer JWT | `tasks.view` | `200` | **List team operational tasks with filters** <br>*(DTO: `ListTeamTasksQuery -> List<TaskItemDto>`)* |
| 181 | `GET` | `/api/v1/tasks/me` | Tasks | Bearer JWT | `None (Authenticated)` | `200` | **Get own assigned tasks (Self)** <br>*(DTO: `ListMyTasksQuery -> List<TaskItemDto>`)* |
| 182 | `GET` | `/api/v1/tasks/{{taskId}}` | Tasks | Bearer JWT | `tasks.view` | `200` | **Get task details by ID** <br>*(DTO: `GetTaskByIdQuery -> TaskItemDto`)* |
| 183 | `POST` | `/api/v1/tasks` | Tasks | Bearer JWT | `tasks.manage` | `200` | **Create and assign operational task** <br>*(DTO: `CreateTaskCommand -> TaskItemDto`)* |
| 184 | `PATCH` | `/api/v1/tasks/{{taskId}}/status` | Tasks | Bearer JWT | `None (Authenticated)` | `200` | **Update task progress status** <br>*(DTO: `UpdateTaskStatusCommand -> TaskItemDto`)* |
| 185 | `PATCH` | `/api/v1/tasks/{{taskId}}/assign` | Tasks | Bearer JWT | `tasks.manage` | `200` | **Reassign task to another employee** <br>*(DTO: `AssignTaskCommand -> TaskItemDto`)* |
| 186 | `DELETE` | `/api/v1/tasks/{{taskId}}` | Tasks | Bearer JWT | `tasks.manage` | `200` | **Delete task** <br>*(DTO: `DeleteTaskCommand -> bool`)* |
| 187 | `GET` | `/api/v1/performance/cycles` | Performance | Bearer JWT | `performance.view` | `200` | **List performance review cycles** <br>*(DTO: `GetPerformanceCyclesQuery -> IReadOnlyList<PerformanceCycleDto>`)* |
| 188 | `POST` | `/api/v1/performance/cycles` | Performance | Bearer JWT | `performance.manage` | `200` | **Create performance appraisal cycle** <br>*(DTO: `CreatePerformanceCycleCommand -> PerformanceCycleDto`)* |
| 189 | `GET` | `/api/v1/performance/appraisals` | Performance | Bearer JWT | `performance.view` | `200` | **List employee appraisals with status filters** <br>*(DTO: `GetAppraisalsListQuery -> PagedResponse<AppraisalDto>`)* |
| 190 | `GET` | `/api/v1/performance/appraisals/{{appraisalId}}` | Performance | Bearer JWT | `performance.view` | `200` | **Get appraisal review details by ID** <br>*(DTO: `GetAppraisalByIdQuery -> AppraisalDto`)* |
| 191 | `POST` | `/api/v1/performance/appraisals` | Performance | Bearer JWT | `performance.manage` | `200` | **Initiate employee appraisal review** <br>*(DTO: `CreateAppraisalCommand -> AppraisalDto`)* |
| 192 | `PUT` | `/api/v1/performance/appraisals/{{appraisalId}}/self-review` | Performance | Bearer JWT | `performance.self` | `200` | **Submit employee self-review assessment** <br>*(DTO: `SubmitSelfReviewCommand -> AppraisalDto`)* |
| 193 | `PUT` | `/api/v1/performance/appraisals/{{appraisalId}}/manager-review` | Performance | Bearer JWT | `performance.manage` | `200` | **Submit manager performance evaluation** <br>*(DTO: `SubmitManagerReviewCommand -> AppraisalDto`)* |
| 194 | `POST` | `/api/v1/performance/appraisals/{{appraisalId}}/finalize` | Performance | Bearer JWT | `performance.manage` | `200` | **Finalize appraisal with score, hike % & promotion** <br>*(DTO: `FinalizeAppraisalCommand -> AppraisalDto`)* |
| 195 | `POST` | `/api/v1/performance/goals` | Performance | Bearer JWT | `performance.self` | `200` | **Create OKR / KPI goal for employee** <br>*(DTO: `CreateGoalCommand -> GoalDto`)* |
| 196 | `GET` | `/api/v1/performance/goals` | Performance | Bearer JWT | `performance.view` | `200` | **List employee goals** <br>*(DTO: `GetEmployeeGoalsQuery -> IReadOnlyList<GoalDto>`)* |
| 197 | `PUT` | `/api/v1/performance/goals/{{goalId}}/progress` | Performance | Bearer JWT | `performance.self` | `200` | **Update goal progress percentage** <br>*(DTO: `UpdateGoalProgressCommand -> GoalDto`)* |
| 198 | `GET` | `/api/v1/training/programs` | Training | Bearer JWT | `training.view` | `200` | **List corporate training programs** <br>*(DTO: `GetTrainingProgramsListQuery -> PagedResponse<TrainingProgramDto>`)* |
| 199 | `GET` | `/api/v1/training/programs/{{programId}}` | Training | Bearer JWT | `training.view` | `200` | **Get training program details by ID** <br>*(DTO: `GetTrainingProgramByIdQuery -> TrainingProgramDto`)* |
| 200 | `POST` | `/api/v1/training/programs` | Training | Bearer JWT | `training.manage` | `200` | **Create corporate training program** <br>*(DTO: `CreateTrainingProgramCommand -> TrainingProgramDto`)* |
| 201 | `POST` | `/api/v1/training/enroll` | Training | Bearer JWT | `training.manage` | `200` | **Enroll employee in training program** <br>*(DTO: `EnrollInTrainingCommand -> TrainingEnrollmentDto`)* |
| 202 | `PATCH` | `/api/v1/training/enrollments/{{enrollmentId}}/complete` | Training | Bearer JWT | `training.manage` | `200` | **Complete training & certify employee** <br>*(DTO: `CompleteTrainingEnrollmentCommand -> TrainingEnrollmentDto`)* |
| 203 | `GET` | `/api/v1/helpdesk` | Helpdesk | Bearer JWT | `helpdesk.view` | `200` | **List company support tickets with filters** <br>*(DTO: `ListHelpdeskTicketsQuery -> List<HelpdeskTicketDto>`)* |
| 204 | `GET` | `/api/v1/helpdesk/me` | Helpdesk | Bearer JWT | `None (Authenticated)` | `200` | **Get own raised support tickets (Self)** <br>*(DTO: `ListMyTicketsQuery -> List<HelpdeskTicketDto>`)* |
| 205 | `GET` | `/api/v1/helpdesk/{{ticketId}}` | Helpdesk | Bearer JWT | `helpdesk.view` | `200` | **Get ticket details with conversation thread** <br>*(DTO: `GetTicketByIdQuery -> HelpdeskTicketDto`)* |
| 206 | `POST` | `/api/v1/helpdesk` | Helpdesk | Bearer JWT | `helpdesk.create` | `200` | **Raise new helpdesk support ticket** <br>*(DTO: `CreateTicketCommand -> HelpdeskTicketDto`)* |
| 207 | `PATCH` | `/api/v1/helpdesk/{{ticketId}}/assign` | Helpdesk | Bearer JWT | `helpdesk.manage` | `200` | **Assign ticket to support agent** <br>*(DTO: `AssignTicketCommand -> HelpdeskTicketDto`)* |
| 208 | `POST` | `/api/v1/helpdesk/{{ticketId}}/comments` | Helpdesk | Bearer JWT | `None (Authenticated)` | `200` | **Add reply comment to ticket thread** <br>*(DTO: `AddTicketCommentCommand -> TicketCommentDto`)* |
| 209 | `PATCH` | `/api/v1/helpdesk/{{ticketId}}/resolve` | Helpdesk | Bearer JWT | `helpdesk.manage` | `200` | **Resolve support ticket** <br>*(DTO: `ResolveTicketCommand -> HelpdeskTicketDto`)* |
| 210 | `PATCH` | `/api/v1/helpdesk/{{ticketId}}/close` | Helpdesk | Bearer JWT | `None (Authenticated)` | `200` | **Close resolved support ticket** <br>*(DTO: `CloseTicketCommand -> HelpdeskTicketDto`)* |
| 211 | `GET` | `/api/v1/documents` | Documents | Bearer JWT | `documents.view` | `200` | **List employee and corporate documents** <br>*(DTO: `GetDocumentsListQuery -> PagedResponse<DocumentDto>`)* |
| 212 | `GET` | `/api/v1/documents/{{documentId}}` | Documents | Bearer JWT | `documents.view` | `200` | **Get document details by ID** <br>*(DTO: `GetDocumentByIdQuery -> DocumentDto`)* |
| 213 | `POST` | `/api/v1/documents` | Documents | Bearer JWT | `documents.manage` | `200` | **Register document storage record** <br>*(DTO: `CreateDocumentCommand -> DocumentDto`)* |
| 214 | `GET` | `/api/v1/documents/{{documentId}}/download` | Documents | Bearer JWT | `documents.view` | `200` | **Get secure pre-signed document download URL** <br>*(DTO: `DownloadDocumentQuery -> DocumentDownloadDto`)* |
| 215 | `GET` | `/api/v1/documents/expiring` | Documents | Bearer JWT | `documents.view` | `200` | **List documents expiring in next 30 days** <br>*(DTO: `GetExpiringDocumentsQuery -> IReadOnlyList<DocumentDto>`)* |
| 216 | `DELETE` | `/api/v1/documents/{{documentId}}` | Documents | Bearer JWT | `documents.manage` | `200` | **Delete document record** <br>*(DTO: `DeleteDocumentCommand -> bool`)* |
| 217 | `GET` | `/api/v1/policies` | Policies | Bearer JWT | `policies.view` | `200` | **List corporate policies and handbooks** <br>*(DTO: `GetPoliciesListQuery -> PagedResponse<PolicyDto>`)* |
| 218 | `GET` | `/api/v1/policies/{{policyId}}` | Policies | Bearer JWT | `policies.view` | `200` | **Get corporate policy by ID** <br>*(DTO: `GetPolicyByIdQuery -> PolicyDto`)* |
| 219 | `POST` | `/api/v1/policies` | Policies | Bearer JWT | `policies.manage` | `200` | **Publish new corporate policy** <br>*(DTO: `CreatePolicyCommand -> PolicyDto`)* |
| 220 | `POST` | `/api/v1/policies/{{policyId}}/acknowledge` | Policies | Bearer JWT | `policies.view` | `200` | **Acknowledge corporate policy (Employee)** <br>*(DTO: `AcknowledgePolicyCommand -> bool`)* |
| 221 | `POST` | `/api/v1/policies/{{policyId}}/versions` | Policies | Bearer JWT | `policies.manage` | `200` | **Publish new revision version for policy** <br>*(DTO: `CreatePolicyVersionCommand -> PolicyDto`)* |
| 222 | `GET` | `/api/v1/policies/{{policyId}}/compliance` | Policies | Bearer JWT | `policies.manage` | `200` | **Get policy compliance acknowledgment audit report** <br>*(DTO: `GetPolicyComplianceReportQuery -> PolicyComplianceAuditDto`)* |
| 223 | `GET` | `/api/v1/recruitment/jobs` | Recruitment | Bearer JWT | `recruitment.view` | `200` | **List job vacancies with filters** <br>*(DTO: `GetJobPostingsListQuery -> PagedResponse<JobPostingDto>`)* |
| 224 | `GET` | `/api/v1/recruitment/jobs/{{jobPostingId}}` | Recruitment | Bearer JWT | `recruitment.view` | `200` | **Get job vacancy details by ID** <br>*(DTO: `GetJobPostingByIdQuery -> JobPostingDto`)* |
| 225 | `POST` | `/api/v1/recruitment/jobs` | Recruitment | Bearer JWT | `recruitment.manage` | `200` | **Create new job vacancy posting** <br>*(DTO: `CreateJobPostingCommand -> JobPostingDto`)* |
| 226 | `PUT` | `/api/v1/recruitment/jobs/{{jobPostingId}}` | Recruitment | Bearer JWT | `recruitment.manage` | `200` | **Update job vacancy details** <br>*(DTO: `UpdateJobPostingCommand -> JobPostingDto`)* |
| 227 | `PATCH` | `/api/v1/recruitment/jobs/{{jobPostingId}}/publish` | Recruitment | Bearer JWT | `recruitment.manage` | `200` | **Publish job vacancy to career portal** <br>*(DTO: `PublishJobPostingCommand -> JobPostingDto`)* |
| 228 | `PATCH` | `/api/v1/recruitment/jobs/{{jobPostingId}}/close` | Recruitment | Bearer JWT | `recruitment.manage` | `200` | **Close job vacancy posting** <br>*(DTO: `CloseJobPostingCommand -> JobPostingDto`)* |
| 229 | `POST` | `/api/v1/recruitment/candidates` | Recruitment | Bearer JWT | `recruitment.manage` | `200` | **Submit candidate applicant profile** <br>*(DTO: `CreateCandidateCommand -> CandidateDto`)* |
| 230 | `GET` | `/api/v1/recruitment/candidates` | Recruitment | Bearer JWT | `recruitment.view` | `200` | **List candidate applicants with stage filters** <br>*(DTO: `GetCandidatesListQuery -> PagedResponse<CandidateDto>`)* |
| 231 | `GET` | `/api/v1/recruitment/candidates/{{candidateId}}` | Recruitment | Bearer JWT | `recruitment.view` | `200` | **Get candidate profile details by ID** <br>*(DTO: `GetCandidateByIdQuery -> CandidateDetailDto`)* |
| 232 | `PATCH` | `/api/v1/recruitment/candidates/{{candidateId}}/stage` | Recruitment | Bearer JWT | `recruitment.manage` | `200` | **Move candidate to next pipeline stage** <br>*(DTO: `MoveCandidateStageCommand -> CandidateDto`)* |
| 233 | `PATCH` | `/api/v1/recruitment/candidates/{{candidateId}}/reject` | Recruitment | Bearer JWT | `recruitment.manage` | `200` | **Reject candidate applicant** <br>*(DTO: `RejectCandidateCommand -> CandidateDto`)* |
| 234 | `POST` | `/api/v1/recruitment/interviews` | Recruitment | Bearer JWT | `recruitment.manage` | `200` | **Schedule interview round with candidate** <br>*(DTO: `ScheduleInterviewCommand -> InterviewDto`)* |
| 235 | `GET` | `/api/v1/recruitment/interviews` | Recruitment | Bearer JWT | `recruitment.view` | `200` | **List scheduled interviews** <br>*(DTO: `GetInterviewsListQuery -> IReadOnlyList<InterviewDto>`)* |
| 236 | `POST` | `/api/v1/recruitment/interviews/{{interviewId}}/feedback` | Recruitment | Bearer JWT | `recruitment.interview` | `200` | **Submit interview feedback & rating score** <br>*(DTO: `SubmitInterviewFeedbackCommand -> InterviewDto`)* |
| 237 | `POST` | `/api/v1/recruitment/offers` | Recruitment | Bearer JWT | `recruitment.manage` | `200` | **Generate formal job offer letter** <br>*(DTO: `CreateJobOfferCommand -> JobOfferDto`)* |
| 238 | `GET` | `/api/v1/recruitment/offers/{{jobOfferId}}` | Recruitment | Bearer JWT | `recruitment.view` | `200` | **Get job offer details by ID** <br>*(DTO: `GetJobOfferByIdQuery -> JobOfferDto`)* |
| 239 | `PATCH` | `/api/v1/recruitment/offers/{{jobOfferId}}/send` | Recruitment | Bearer JWT | `recruitment.manage` | `200` | **Formally dispatch job offer to candidate** <br>*(DTO: `SendJobOfferCommand -> JobOfferDto`)* |
| 240 | `PATCH` | `/api/v1/recruitment/offers/{{jobOfferId}}/accept` | Recruitment | Bearer JWT | `recruitment.manage` | `200` | **Register candidate offer acceptance** <br>*(DTO: `AcceptJobOfferCommand -> JobOfferDto`)* |
| 241 | `PATCH` | `/api/v1/recruitment/offers/{{jobOfferId}}/decline` | Recruitment | Bearer JWT | `recruitment.manage` | `200` | **Register candidate offer decline** <br>*(DTO: `DeclineJobOfferCommand -> JobOfferDto`)* |
| 242 | `GET` | `/api/v1/recruitment/offers/{{jobOfferId}}/pdf` | Recruitment | Bearer JWT | `recruitment.view` | `200` | **Download branded offer letter PDF** <br>*(DTO: `GetOfferLetterPdfQuery -> OfferLetterPdfDto`)* |
| 243 | `GET` | `/api/v1/recruitment/pipeline` | Recruitment | Bearer JWT | `recruitment.view` | `200` | **Get recruitment pipeline funnel analytics** <br>*(DTO: `GetRecruitmentPipelineQuery -> RecruitmentPipelineDto`)* |
| 244 | `GET` | `/api/v1/onboarding/checklists` | Onboarding | Bearer JWT | `onboarding.view` | `200` | **List corporate onboarding checklist templates** <br>*(DTO: `GetOnboardingChecklistsQuery -> IReadOnlyList<OnboardingChecklistDto>`)* |
| 245 | `POST` | `/api/v1/onboarding/checklists` | Onboarding | Bearer JWT | `onboarding.manage` | `200` | **Create onboarding checklist item** <br>*(DTO: `CreateOnboardingChecklistCommand -> OnboardingChecklistDto`)* |
| 246 | `GET` | `/api/v1/onboarding/employee/{{employeeId}}` | Onboarding | Bearer JWT | `onboarding.view` | `200` | **Get employee onboarding progression state** <br>*(DTO: `GetEmployeeOnboardingStateQuery -> EmployeeOnboardingStateDto`)* |
| 247 | `PATCH` | `/api/v1/onboarding/verify-item` | Onboarding | Bearer JWT | `onboarding.manage` | `200` | **Verify onboarding checklist item** <br>*(DTO: `VerifyOnboardingItemCommand -> bool`)* |
| 248 | `GET` | `/api/v1/reports/headcount` | Reports | Bearer JWT | `reports.view` | `200` | **Get headcount demographics and distribution report** <br>*(DTO: `GetHeadcountReportQuery -> HeadcountReportDto`)* |
| 249 | `GET` | `/api/v1/reports/attendance` | Reports | Bearer JWT | `reports.view` | `200` | **Get attendance and punctuality analytics report** <br>*(DTO: `GetAttendanceReportQuery -> AttendanceReportDto`)* |
| 250 | `GET` | `/api/v1/reports/leave` | Reports | Bearer JWT | `reports.view` | `200` | **Get leave utilization and encashment liability report** <br>*(DTO: `GetLeaveReportQuery -> LeaveReportDto`)* |
| 251 | `GET` | `/api/v1/reports/payroll` | Reports | Bearer JWT | `reports.view` | `200` | **Get payroll expenditure and cost analysis report** <br>*(DTO: `GetPayrollReportQuery -> PayrollReportDto`)* |
| 252 | `GET` | `/api/v1/reports/attrition` | Reports | Bearer JWT | `reports.view` | `200` | **Get workforce attrition and retention metrics** <br>*(DTO: `GetAttritionReportQuery -> AttritionReportDto`)* |
| 253 | `POST` | `/api/v1/reports/custom/export` | Reports | Bearer JWT | `reports.export` | `200` | **Generate custom dynamic Excel report export** <br>*(DTO: `ExportCustomReportCommand -> CustomReportExportDto`)* |
| 254 | `GET` | `/api/v1/dashboard/summary` | Dashboard | Bearer JWT | `dashboard.view` | `200` | **Get top-level executive HRMS dashboard summary** <br>*(DTO: `GetDashboardSummaryQuery -> DashboardSummaryDto`)* |
| 255 | `GET` | `/api/v1/dashboard/headcount-by-department` | Dashboard | Bearer JWT | `dashboard.view` | `200` | **Get headcount distribution chart data by department** <br>*(DTO: `GetHeadcountByDepartmentQuery -> IReadOnlyList<DepartmentHeadcountDto>`)* |
| 256 | `GET` | `/api/v1/dashboard/recent-activities` | Dashboard | Bearer JWT | `dashboard.view` | `200` | **Get real-time system activity stream feed** <br>*(DTO: `GetRecentActivitiesQuery -> IReadOnlyList<RecentActivityDto>`)* |
| 257 | `GET` | `/api/v1/dashboard/upcoming-leaves` | Dashboard | Bearer JWT | `dashboard.view` | `200` | **Get upcoming approved leaves for next 7 days** <br>*(DTO: `GetUpcomingLeavesQuery -> IReadOnlyList<UpcomingLeaveDto>`)* |
| 258 | `GET` | `/api/v1/dashboard/attendance-today` | Dashboard | Bearer JWT | `dashboard.view` | `200` | **Get real-time attendance KPIs for today** <br>*(DTO: `GetTodayAttendanceDashboardQuery -> TodayAttendanceDashboardDto`)* |
| 259 | `GET` | `/api/v1/settings` | Settings | Bearer JWT | `settings.view` | `200` | **List corporate system configuration parameters** <br>*(DTO: `GetCompanySettingsQuery -> IReadOnlyList<SystemSettingDto>`)* |
| 260 | `PUT` | `/api/v1/settings` | Settings | Bearer JWT | `settings.manage` | `200` | **Batch update corporate configuration parameters** <br>*(DTO: `UpdateCompanySettingsCommand -> IReadOnlyList<SystemSettingDto>`)* |
| 261 | `GET` | `/api/v1/financial-years` | Settings | Bearer JWT | `settings.view` | `200` | **List company financial years** <br>*(DTO: `GetFinancialYearsListQuery -> IReadOnlyList<FinancialYearDto>`)* |
| 262 | `POST` | `/api/v1/financial-years` | Settings | Bearer JWT | `settings.manage` | `200` | **Create new financial year period** <br>*(DTO: `CreateFinancialYearCommand -> FinancialYearDto`)* |
| 263 | `PATCH` | `/api/v1/financial-years/{{financialYearId}}/close` | Settings | Bearer JWT | `settings.manage` | `200` | **Close financial year, locking historical edits** <br>*(DTO: `CloseFinancialYearCommand -> FinancialYearDto`)* |
| 264 | `GET` | `/api/v1/audit-logs` | AuditLogs | Bearer JWT | `audit.view` | `200` | **Query immutable system audit logs with filters** <br>*(DTO: `GetAuditLogsListQuery -> PagedResponse<AuditLogDto>`)* |
| 265 | `GET` | `/api/v1/audit-logs/Employee/{{employeeId}}` | AuditLogs | Bearer JWT | `audit.view` | `200` | **Get entity-specific change history logs** <br>*(DTO: `GetEntityAuditLogsQuery -> IReadOnlyList<AuditLogDto>`)* |
| 266 | `GET` | `/api/v1/audit-logs/export` | AuditLogs | Bearer JWT | `audit.view` | `200` | **Export audit log records as CSV file** <br>*(DTO: `ExportAuditLogsQuery -> string`)* |
| 267 | `GET` | `/api/v1/notifications` | Notifications | Bearer JWT | `None (Authenticated)` | `200` | **Get paginated user in-app notifications** <br>*(DTO: `GetNotificationsListQuery -> PagedResponse<NotificationDto>`)* |
| 268 | `GET` | `/api/v1/notifications/unread-count` | Notifications | Bearer JWT | `None (Authenticated)` | `200` | **Get unread notifications counter for top-bar badge** <br>*(DTO: `GetUnreadNotificationsCountQuery -> UnreadNotificationCountDto`)* |
| 269 | `PATCH` | `/api/v1/notifications/{{notificationId}}/read` | Notifications | Bearer JWT | `None (Authenticated)` | `200` | **Mark specific notification as read** <br>*(DTO: `MarkNotificationReadCommand -> bool`)* |
| 270 | `PATCH` | `/api/v1/notifications/read-all` | Notifications | Bearer JWT | `None (Authenticated)` | `200` | **Mark all notifications as read** <br>*(DTO: `MarkAllNotificationsReadCommand -> bool`)* |
| 271 | `POST` | `/api/v1/ai/ask` | WorkoraAI | Bearer JWT | `None (Authenticated)` | `200` | **Ask conversational prompt to Workora AI Assistant** <br>*(DTO: `AskWorkoraAiAssistantCommand -> AiAssistantResponseDto`)* |


---

*Generated automatically from Workora ASP.NET Core .NET 9 backend source code.*