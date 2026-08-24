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

    // Holidays
    [Description("Holiday created successfully.")]
    HolidayCreated,

    [Description("Holiday updated successfully.")]
    HolidayUpdated,

    [Description("Holiday deleted successfully.")]
    HolidayDeleted,

    [Description("Holiday not found.")]
    HolidayNotFound,

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

    // Salary & Payroll
    [Description("Salary structure created successfully.")]
    SalaryStructureCreated,

    [Description("Salary structure updated successfully.")]
    SalaryStructureUpdated,

    [Description("Salary structure assigned to employee successfully.")]
    SalaryStructureAssigned,

    [Description("Salary structure not found.")]
    SalaryStructureNotFound,

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

    [Description("Payslip not found.")]
    PayslipNotFound,

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

    [Description("Asset assigned to employee.")]
    AssetAssigned,

    [Description("Asset returned successfully.")]
    AssetReturned,

    [Description("Asset not found.")]
    AssetNotFound,

    [Description("No active assignment found for this asset.")]
    AssetNoActiveAssignment,

    [Description("No active assignment found for this asset.")]
    AssetNotAssigned,

    // Documents
    [Description("Document recorded successfully.")]
    DocumentCreated,

    [Description("Document uploaded successfully.")]
    DocumentUploaded,

    [Description("Document deleted successfully.")]
    DocumentDeleted,

    [Description("Document not found.")]
    DocumentNotFound,

    // Policies
    [Description("Policy created successfully.")]
    PolicyCreated,

    [Description("Policy acknowledged successfully.")]
    PolicyAcknowledged,

    [Description("Policy already acknowledged.")]
    PolicyAlreadyAcknowledged,

    [Description("Policy not found.")]
    PolicyNotFound,

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
    SystemSettingUpdated
}
