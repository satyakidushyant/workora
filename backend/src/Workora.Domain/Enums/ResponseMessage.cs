using System.ComponentModel;

namespace Workora.Domain.Enums;

/// <summary>
/// Defines standard response messages used across the application.
/// </summary>
public enum ResponseMessage
{
    // Generic
    [Description("Operation successful.")]
    Success,

    [Description("Operation failed.")]
    Failed,

    [Description("Record created successfully.")]
    Created,

    [Description("Record updated successfully.")]
    Updated,

    [Description("Record deleted successfully.")]
    Deleted,

    [Description("Record not found.")]
    NotFound,

    [Description("Access forbidden.")]
    Forbidden,

    [Description("Unauthorized access.")]
    Unauthorized,

    [Description("User context not available or unauthenticated.")]
    UserContextUnavailable,

    [Description("Validation failed.")]
    ValidationFailed,

    [Description("An unexpected error occurred.")]
    UnexpectedError,

    // Auth & Identity
    [Description("Invalid email or password.")]
    InvalidCredentials,

    [Description("Account is temporarily locked.")]
    AccountLocked,

    [Description("User not found or inactive.")]
    UserNotFound,

    [Description("User created successfully.")]
    UserCreated,

    [Description("User updated successfully.")]
    UserUpdated,

    [Description("User deactivated successfully.")]
    UserDeactivated,

    [Description("User activated successfully.")]
    UserActivated,

    [Description("User deleted successfully.")]
    UserDeleted,

    [Description("User roles assigned successfully.")]
    UserRolesAssigned,

    [Description("Password reset successfully.")]
    PasswordResetSuccess,

    [Description("Invalid or expired token.")]
    InvalidToken,

    [Description("Incorrect old password.")]
    IncorrectOldPassword,

    [Description("User identity could not be resolved from token.")]
    UserIdentityUnresolved,

    [Description("A user with this email address already exists.")]
    UserEmailAlreadyExists,

    [Description("Cannot deactivate the sole active user account in the system.")]
    CannotDeactivateSoleUser,

    [Description("Cannot delete the sole user account in the system.")]
    CannotDeleteSoleUser,

    [Description("No employee record is linked to this user account.")]
    NoEmployeeLinkedToUser,

    // Roles & Permissions
    [Description("Role created successfully.")]
    RoleCreated,

    [Description("Role updated successfully.")]
    RoleUpdated,

    [Description("Role deleted successfully.")]
    RoleDeleted,

    [Description("Role not found.")]
    RoleNotFound,

    [Description("Cannot modify or delete a system-defined role.")]
    SystemRoleImmutable,

    [Description("Role permissions updated successfully.")]
    RolePermissionsUpdated,

    [Description("A role with this name already exists.")]
    RoleNameAlreadyExists,

    [Description("Role cannot be deleted because it is currently assigned to one or more users.")]
    RoleInUseCannotBeDeleted,

    // Companies & Structure
    [Description("Company created successfully.")]
    CompanyCreated,

    [Description("Company updated successfully.")]
    CompanyUpdated,

    [Description("Company not found.")]
    CompanyNotFound,

    [Description("Branch created successfully.")]
    BranchCreated,

    [Description("Branch updated successfully.")]
    BranchUpdated,

    [Description("Branch deleted successfully.")]
    BranchDeleted,

    [Description("Branch not found.")]
    BranchNotFound,

    [Description("A branch with this code already exists for this company.")]
    BranchCodeAlreadyExists,

    [Description("Department created successfully.")]
    DepartmentCreated,

    [Description("Department updated successfully.")]
    DepartmentUpdated,

    [Description("Department deleted successfully.")]
    DepartmentDeleted,

    [Description("Department status updated successfully.")]
    DepartmentStatusUpdated,

    [Description("Department not found.")]
    DepartmentNotFound,

    [Description("A department with this code already exists for this company.")]
    DepartmentCodeAlreadyExists,

    [Description("Designation created successfully.")]
    DesignationCreated,

    [Description("Designation updated successfully.")]
    DesignationUpdated,

    [Description("Designation deleted successfully.")]
    DesignationDeleted,

    [Description("Designation status updated successfully.")]
    DesignationStatusUpdated,

    [Description("Designation not found.")]
    DesignationNotFound,

    [Description("A designation with this title already exists in the department.")]
    DesignationTitleAlreadyExists,

    // Employees
    [Description("Employee onboarded successfully.")]
    EmployeeCreated,

    [Description("Employee profile updated successfully.")]
    EmployeeUpdated,

    [Description("Employee transferred successfully.")]
    EmployeeTransferred,

    [Description("Employee offboarded/terminated successfully.")]
    EmployeeTerminated,

    [Description("Employee reactivated successfully.")]
    EmployeeReactivated,

    [Description("Emergency contacts updated successfully.")]
    EmergencyContactsUpdated,

    [Description("Bank details updated successfully.")]
    BankDetailsUpdated,

    [Description("Employee not found.")]
    EmployeeNotFound,

    [Description("An employee with this email already exists.")]
    EmployeeEmailAlreadyExists,

    [Description("An employee with this national ID already exists.")]
    EmployeeNationalIdAlreadyExists,

    [Description("Only active employees can be promoted.")]
    OnlyActiveEmployeesCanBePromoted,

    [Description("Employee is already at the target designation.")]
    EmployeeAlreadyAtDesignation,

    [Description("An employee cannot be their own manager.")]
    EmployeeCannotBeOwnManager,

    [Description("Employees imported successfully.")]
    EmployeesBulkImported,

    // Shifts
    [Description("Shift template created successfully.")]
    ShiftCreated,

    [Description("Shift template updated successfully.")]
    ShiftUpdated,

    [Description("Shift template deleted successfully.")]
    ShiftDeleted,

    [Description("Shift assigned to employee successfully.")]
    ShiftAssigned,

    [Description("Shift unassigned successfully.")]
    ShiftUnassigned,

    [Description("Shift template not found.")]
    ShiftNotFound,

    [Description("A shift with this code already exists for the company.")]
    ShiftCodeAlreadyExists,

    [Description("No active shift assignment found for this employee.")]
    ShiftNoActiveAssignment,

    [Description("Active shift assignments not found for one or both target employees.")]
    ShiftSwapInvalidAssignments,

    [Description("Employee shift assignments swapped successfully.")]
    ShiftSwapped,

    [Description("Rotational shift assigned to employees successfully.")]
    ShiftRosterAssigned,

    [Description("Monthly shift roster schedule retrieved successfully.")]
    ShiftRosterRetrieved,

    // Holidays
    [Description("Holiday created successfully.")]
    HolidayCreated,

    [Description("Holiday updated successfully.")]
    HolidayUpdated,

    [Description("Holiday deleted successfully.")]
    HolidayDeleted,

    [Description("Holiday not found.")]
    HolidayNotFound,

    [Description("A holiday is already configured for this date and scope.")]
    HolidayAlreadyExists,

    [Description("Holidays imported successfully.")]
    HolidaysBulkImported,

    [Description("Weekly off policy updated successfully.")]
    WeeklyOffPolicyUpdated,

    [Description("Weekly off policy retrieved successfully.")]
    WeeklyOffPolicyRetrieved,

    // Attendance
    [Description("Attendance check-in recorded successfully.")]
    AttendanceCheckedIn,

    [Description("Attendance check-out recorded successfully.")]
    AttendanceCheckedOut,

    [Description("Attendance record not found.")]
    AttendanceNotFound,

    [Description("Attendance correction requested successfully.")]
    AttendanceCorrectionRequested,

    [Description("Attendance correction approved successfully.")]
    AttendanceCorrectionApproved,

    [Description("Attendance correction rejected.")]
    AttendanceCorrectionRejected,

    [Description("Attendance correction not found.")]
    AttendanceCorrectionNotFound,

    [Description("Attendance bulk records imported successfully.")]
    AttendanceBulkImported,

    [Description("You have already checked in today.")]
    AttendanceAlreadyCheckedIn,

    [Description("You must check in first before checking out.")]
    AttendanceMustCheckInFirst,

    [Description("Biometric punches ingested successfully.")]
    BiometricPunchesIngested,

    [Description("Live attendance status retrieved successfully.")]
    LiveAttendanceStatusRetrieved,

    // Leave
    [Description("Leave application submitted successfully.")]
    LeaveApplied,

    [Description("Leave request approved successfully.")]
    LeaveApproved,

    [Description("Leave request rejected.")]
    LeaveRejected,

    [Description("Leave request cancelled successfully.")]
    LeaveCancelled,

    [Description("Leave request not found.")]
    LeaveRequestNotFound,

    [Description("Leave type created successfully.")]
    LeaveTypeCreated,

    [Description("Leave type updated successfully.")]
    LeaveTypeUpdated,

    [Description("Leave type not found.")]
    LeaveTypeNotFound,

    [Description("Insufficient leave balance for this request.")]
    InsufficientLeaveBalance,

    [Description("You already have an approved leave request in this date range.")]
    LeaveAlreadyRequestedForRange,

    [Description("Only pending leave requests can be approved.")]
    LeaveOnlyPendingCanBeApproved,

    [Description("Only pending leave requests can be rejected.")]
    LeaveOnlyPendingCanBeRejected,

    [Description("This leave request is already closed.")]
    LeaveRequestAlreadyClosed,

    [Description("Leave balances retrieved successfully.")]
    LeaveBalancesRetrieved,

    // Salary & Payroll
    [Description("Salary structure created successfully.")]
    SalaryStructureCreated,

    [Description("Salary structure updated successfully.")]
    SalaryStructureUpdated,

    [Description("Salary structure assigned to employee successfully.")]
    SalaryStructureAssigned,

    [Description("Salary structure not found.")]
    SalaryStructureNotFound,

    [Description("No active salary structure assigned to this employee.")]
    SalaryStructureNotAssigned,

    [Description("Salary payhead created successfully.")]
    PayheadCreated,

    [Description("Salary payhead updated successfully.")]
    PayheadUpdated,

    [Description("Salary payhead not found.")]
    PayheadNotFound,

    [Description("Payheads list retrieved successfully.")]
    PayheadsRetrieved,

    [Description("Payroll run computed successfully.")]
    PayrollRunCalculated,

    [Description("Payroll run generated successfully.")]
    PayrollRunCreated,

    [Description("Payroll run approved successfully.")]
    PayrollRunApproved,

    [Description("Payroll run disbursed successfully.")]
    PayrollRunDisbursed,

    [Description("Payroll run not found.")]
    PayrollRunNotFound,

    [Description("A payroll run for this period already exists.")]
    PayrollRunAlreadyExists,

    [Description("Payslip not found.")]
    PayslipNotFound,

    [Description("Employee payslip retrieved successfully.")]
    PayslipRetrieved,

    [Description("Bulk payslips archive prepared successfully.")]
    BulkPayslipsArchivePrepared,

    [Description("Bank disbursement payment file generated successfully.")]
    PayrollDisbursementFileGenerated,

    [Description("Only calculated payroll runs can be approved.")]
    PayrollRunMustBeCalculatedToApprove,

    [Description("Only approved payroll runs can be disbursed.")]
    PayrollRunMustBeApprovedToDisburse,

    // Recruitment
    [Description("Job vacancy created successfully.")]
    JobPostingCreated,

    [Description("Job vacancy updated successfully.")]
    JobPostingUpdated,

    [Description("Job vacancy published.")]
    JobPostingPublished,

    [Description("Job vacancy closed.")]
    JobPostingClosed,

    [Description("Job posting not found.")]
    JobPostingNotFound,

    [Description("Candidate application submitted successfully.")]
    CandidateCreated,

    [Description("Candidate moved to new recruitment stage.")]
    CandidateStageMoved,

    [Description("Candidate stage updated successfully.")]
    CandidateStageUpdated,

    [Description("Candidate rejected.")]
    CandidateRejected,

    [Description("Candidate not found.")]
    CandidateNotFound,

    [Description("Interview scheduled successfully.")]
    InterviewScheduled,

    [Description("Interview feedback submitted successfully.")]
    InterviewFeedbackSubmitted,

    [Description("Interview not found.")]
    InterviewNotFound,

    [Description("Job offer generated successfully.")]
    JobOfferCreated,

    [Description("Job offer sent to candidate.")]
    JobOfferSent,

    [Description("Job offer accepted and candidate hired.")]
    JobOfferAccepted,

    [Description("Job offer marked as declined.")]
    JobOfferDeclined,

    [Description("Job offer not found.")]
    JobOfferNotFound,

    [Description("Job offer letter email resent successfully to candidate.")]
    JobOfferResent,

    [Description("Offer letter PDF URL generated successfully.")]
    OfferLetterPdfGenerated,

    // Performance
    [Description("Appraisal review cycle initiated.")]
    AppraisalCreated,

    [Description("Self-review assessment submitted successfully.")]
    SelfReviewSubmitted,

    [Description("Manager evaluation submitted successfully.")]
    ManagerReviewSubmitted,

    [Description("Appraisal finalized.")]
    AppraisalFinalized,

    [Description("Appraisal record not found.")]
    AppraisalNotFound,

    [Description("Performance goal created.")]
    GoalCreated,

    [Description("Goal progress updated.")]
    GoalProgressUpdated,

    [Description("Goal not found.")]
    GoalNotFound,

    [Description("Performance review cycle initialized successfully.")]
    PerformanceCycleCreated,

    [Description("Performance review cycles retrieved successfully.")]
    PerformanceCyclesRetrieved,

    // Training
    [Description("Training program created successfully.")]
    TrainingProgramCreated,

    [Description("Employee enrolled successfully.")]
    TrainingEnrollmentCreated,

    [Description("Employee enrolled in training successfully.")]
    EmployeeEnrolledInTraining,

    [Description("Training program completed.")]
    TrainingProgramCompleted,

    [Description("Training program not found.")]
    TrainingProgramNotFound,

    [Description("Training program is at full capacity.")]
    TrainingProgramFull,

    [Description("Training enrollment not found.")]
    TrainingEnrollmentNotFound,

    // Assets
    [Description("Asset created successfully.")]
    AssetCreated,

    [Description("Asset details updated successfully.")]
    AssetUpdated,

    [Description("Asset assigned to employee.")]
    AssetAssigned,

    [Description("Asset returned successfully.")]
    AssetReturned,

    [Description("Asset not found.")]
    AssetNotFound,

    [Description("Asset details retrieved successfully.")]
    AssetRetrieved,

    [Description("No active assignment found for this asset.")]
    AssetNoActiveAssignment,

    [Description("No active assignment found for this asset.")]
    AssetNotAssigned,

    [Description("Asset is currently not available and cannot be assigned.")]
    AssetNotAvailable,

    [Description("Assigned assets list retrieved successfully.")]
    CallerAssignedAssetsRetrieved,

    // Documents
    [Description("Document recorded successfully.")]
    DocumentCreated,

    [Description("Document uploaded successfully.")]
    DocumentUploaded,

    [Description("Document deleted successfully.")]
    DocumentDeleted,

    [Description("Document not found.")]
    DocumentNotFound,

    [Description("Document download link generated successfully.")]
    DocumentDownloadLinkGenerated,

    [Description("Expiring documents list retrieved successfully.")]
    ExpiringDocumentsRetrieved,

    // Policies
    [Description("Policy created successfully.")]
    PolicyCreated,

    [Description("Policy acknowledged successfully.")]
    PolicyAcknowledged,

    [Description("Policy already acknowledged.")]
    PolicyAlreadyAcknowledged,

    [Description("Policy not found.")]
    PolicyNotFound,

    [Description("Policy version published successfully.")]
    PolicyVersionPublished,

    [Description("Policy compliance audit report calculated successfully.")]
    PolicyComplianceReportCalculated,

    // Notifications & Settings
    [Description("Notification marked as read.")]
    NotificationMarkedRead,

    [Description("All notifications marked as read.")]
    AllNotificationsMarkedRead,

    [Description("Notification not found.")]
    NotificationNotFound,

    [Description("System settings updated successfully.")]
    SettingsUpdated,

    [Description("System settings updated successfully.")]
    SystemSettingUpdated,

    // Tasks
    [Description("Task created successfully.")]
    TaskCreated,

    [Description("Task updated successfully.")]
    TaskUpdated,

    [Description("Task deleted successfully.")]
    TaskDeleted,

    [Description("Task not found.")]
    TaskNotFound,

    [Description("Task status updated.")]
    TaskStatusUpdated,

    [Description("Task reassigned successfully.")]
    TaskReassigned,

    // Helpdesk
    [Description("Ticket created successfully.")]
    TicketCreated,

    [Description("Ticket assigned successfully.")]
    TicketAssigned,

    [Description("Ticket closed.")]
    TicketClosed,

    [Description("Ticket resolved successfully.")]
    TicketResolved,

    [Description("Ticket not found.")]
    TicketNotFound,

    [Description("Ticket comment posted successfully.")]
    TicketCommentPosted,

    // Loans
    [Description("Loan application submitted successfully.")]
    LoanApplied,

    [Description("Loan approved and EMI schedule generated successfully.")]
    LoanApproved,

    [Description("Loan application rejected.")]
    LoanRejected,

    [Description("Loan record not found.")]
    LoanNotFound,

    // Expenses
    [Description("Expense claim submitted successfully.")]
    ExpenseClaimSubmitted,

    [Description("Expense claim approved successfully.")]
    ExpenseClaimApproved,

    [Description("Expense claim rejected.")]
    ExpenseClaimRejected,

    [Description("Expense claim not found.")]
    ExpenseClaimNotFound,

    // Field Tracking
    [Description("Field visit record not found.")]
    FieldVisitNotFound,

    [Description("Visit check-in recorded successfully.")]
    FieldVisitCheckedIn,

    [Description("Visit check-out recorded successfully.")]
    FieldVisitCheckedOut,

    [Description("GPS telemetry ping recorded.")]
    GpsPingRecorded,

    // Financial Years
    [Description("An active financial year already exists. Please close it first.")]
    FinancialYearActiveAlreadyExists,

    [Description("This financial year is already closed.")]
    FinancialYearAlreadyClosed,

    // Overtime
    [Description("Overtime request created successfully.")]
    OvertimeRequestCreated,

    [Description("Overtime request approved successfully.")]
    OvertimeRequestApproved,

    [Description("Overtime request rejected successfully.")]
    OvertimeRequestRejected,

    [Description("Overtime request cancelled successfully.")]
    OvertimeRequestCancelled,

    [Description("Overtime request not found.")]
    OvertimeRequestNotFound,

    [Description("An overtime request already exists for this employee on this date.")]
    OvertimeRequestAlreadyExists,

    [Description("Only pending overtime requests can be approved.")]
    OvertimeOnlyPendingCanBeApproved,

    [Description("Only pending overtime requests can be rejected.")]
    OvertimeOnlyPendingCanBeRejected,

    [Description("This overtime request is already closed.")]
    OvertimeRequestAlreadyClosed,

    [Description("Cannot cancel an approved overtime request. Please contact HR.")]
    OvertimeApprovedCannotCancel,

    // Onboarding
    [Description("Onboarding record not found for this employee and checklist item.")]
    OnboardingItemNotFound,

    [Description("This onboarding item is already verified.")]
    OnboardingItemAlreadyVerified,

    // Compliance
    [Description("Tax declaration submitted successfully.")]
    TaxDeclarationSubmitted,

    [Description("EPF ECR text file generated successfully.")]
    EpfEcrGenerated,

    [Description("ESIC monthly return generated successfully.")]
    EsicReturnGenerated,

    [Description("PT monthly return generated successfully.")]
    PtReturnGenerated,

    [Description("Form 16 tax certificate generated successfully.")]
    Form16Generated,

    // Reports & Audit
    [Description("Audit log CSV export generated successfully.")]
    AuditLogExportGenerated,

    [Description("Audit logs retrieved successfully.")]
    AuditLogsRetrieved,

    [Description("Custom report export generated successfully.")]
    CustomReportExportGenerated,

    [Description("Attrition report metrics computed successfully.")]
    AttritionReportComputed,

    // SuperAdmin
    [Description("Organization not found.")]
    OrganizationNotFound,

    [Description("An organization with this code already exists.")]
    OrganizationCodeAlreadyExists,

    [Description("Tenant organization registered successfully.")]
    OrganizationRegistered,

    [Description("Organization reactivated successfully.")]
    OrganizationReactivated,

    [Description("Organization suspended successfully.")]
    OrganizationSuspended,

    [Description("Organization updated successfully.")]
    OrganizationUpdated,

    [Description("Organization details retrieved successfully.")]
    OrganizationRetrieved,

    [Description("Organizations retrieved successfully.")]
    OrganizationsRetrieved,

    [Description("Subscription plan not found.")]
    SubscriptionPlanNotFound,

    [Description("Subscription plan created successfully.")]
    SubscriptionPlanCreated,

    [Description("Subscription plan updated successfully.")]
    SubscriptionPlanUpdated,

    [Description("Subscription plan deleted successfully.")]
    SubscriptionPlanDeleted,

    [Description("Subscription plans retrieved successfully.")]
    SubscriptionPlansRetrieved,

    [Description("Global platform metrics retrieved successfully.")]
    SuperAdminMetricsRetrieved
}
