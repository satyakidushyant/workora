using Workora.Domain.Common;
using Workora.Domain.Enums;
using Workora.Domain.Exceptions;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an internal HR, payroll, or IT support ticket.
/// </summary>
public class HelpdeskTicket : AuditableEntity
{
    /// <summary>
    /// Foreign key to the company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Unique formatted ticket code (e.g. TKT-2026-0001).
    /// </summary>
    public string TicketNumber { get; private set; } = string.Empty;

    /// <summary>
    /// The employee who raised the issue.
    /// </summary>
    public int RaisedByEmployeeId { get; private set; }

    /// <summary>
    /// Gets the navigation property for the employee who raised the ticket.
    /// </summary>
    public Employee RaisedByEmployee { get; private set; } = null!;

    /// <summary>
    /// The support agent/HR officer assigned to solve the ticket.
    /// </summary>
    public int? AssignedToEmployeeId { get; private set; }

    /// <summary>
    /// Gets the navigation property for the assigned employee.
    /// </summary>
    public Employee? AssignedToEmployee { get; private set; }

    /// <summary>
    /// Category of the issue (Payroll, Attendance, ITSupport, etc.).
    /// </summary>
    public TicketCategory Category { get; private set; }

    /// <summary>
    /// Short subject line.
    /// </summary>
    public string Subject { get; private set; } = string.Empty;

    /// <summary>
    /// Detailed description of the issue.
    /// </summary>
    public string Description { get; private set; } = string.Empty;

    /// <summary>
    /// Priority level (Low, Medium, High, Urgent).
    /// </summary>
    public TicketPriority Priority { get; private set; }

    /// <summary>
    /// Current resolution status.
    /// </summary>
    public TicketStatus Status { get; private set; }

    /// <summary>
    /// Timestamp when resolution was provided.
    /// </summary>
    public DateTimeOffset? ResolvedAt { get; private set; }

    /// <summary>
    /// Summary notes on how the ticket was resolved.
    /// </summary>
    public string? ResolutionNotes { get; private set; }

    private readonly List<HelpdeskTicketComment> _comments = new();

    /// <summary>
    /// Gets the conversation comments on this ticket.
    /// </summary>
    public IReadOnlyCollection<HelpdeskTicketComment> Comments => _comments.AsReadOnly();

    private HelpdeskTicket() { } // EF Core

    /// <summary>
    /// Factory method to create a new ticket.
    /// </summary>
    public static HelpdeskTicket Create(
        int companyId,
        string ticketNumber,
        int raisedByEmployeeId,
        TicketCategory category,
        string subject,
        string description,
        TicketPriority priority)
    {
        if (string.IsNullOrWhiteSpace(subject))
            throw new DomainException("Ticket subject is required.");

        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException("Ticket description is required.");

        return new HelpdeskTicket
        {
            CompanyId = companyId,
            TicketNumber = ticketNumber,
            RaisedByEmployeeId = raisedByEmployeeId,
            Category = category,
            Subject = subject,
            Description = description,
            Priority = priority,
            Status = TicketStatus.Open
        };
    }

    /// <summary>
    /// Assigns the ticket to a support agent.
    /// </summary>
    public void Assign(int assignedToEmployeeId)
    {
        AssignedToEmployeeId = assignedToEmployeeId;
        Status = TicketStatus.Assigned;
    }

    /// <summary>
    /// Marks the ticket as resolved.
    /// </summary>
    public void Resolve(string resolutionNotes)
    {
        Status = TicketStatus.Resolved;
        ResolvedAt = DateTimeOffset.UtcNow;
        ResolutionNotes = resolutionNotes;
    }

    /// <summary>
    /// Closes the ticket.
    /// </summary>
    public void Close()
    {
        Status = TicketStatus.Closed;
    }
}
