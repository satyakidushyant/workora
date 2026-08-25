namespace Workora.Domain.Enums;

/// <summary>
/// Defines the categories of internal HR and IT helpdesk tickets.
/// </summary>
public enum TicketCategory
{
    /// <summary>
    /// Payroll calculations, deductions, or payslip queries.
    /// </summary>
    Payroll = 1,

    /// <summary>
    /// Attendance logs, biometric punch, or regularization disputes.
    /// </summary>
    Attendance = 2,

    /// <summary>
    /// Hardware, software, email, or IT infrastructure support.
    /// </summary>
    ITSupport = 3,

    /// <summary>
    /// Office facilities, seating, identity cards, or general admin.
    /// </summary>
    Admin = 4,

    /// <summary>
    /// Clarification on company rules, benefits, or HR policies.
    /// </summary>
    HRPolicy = 5,

    /// <summary>
    /// Other miscellaneous issues.
    /// </summary>
    Other = 6
}
