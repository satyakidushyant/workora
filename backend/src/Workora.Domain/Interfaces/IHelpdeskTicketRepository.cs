using Workora.Domain.Entities;
using Workora.Domain.Enums;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for support and HR helpdesk tickets.
/// </summary>
public interface IHelpdeskTicketRepository : IRepository<HelpdeskTicket>
{
    /// <summary>
    /// Gets ticket with conversation comments thread.
    /// </summary>
    Task<HelpdeskTicket?> GetWithCommentsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets tickets raised by a specific employee.
    /// </summary>
    Task<List<HelpdeskTicket>> GetTicketsByEmployeeAsync(int employeeId, CancellationToken ct = default);

    /// <summary>
    /// Gets tickets assigned to a support agent.
    /// </summary>
    Task<List<HelpdeskTicket>> GetTicketsByAssigneeAsync(int agentEmployeeId, CancellationToken ct = default);

    /// <summary>
    /// Gets company tickets filtered by status, category, and priority.
    /// </summary>
    Task<List<HelpdeskTicket>> GetCompanyTicketsAsync(int? companyId, TicketStatus? status, TicketCategory? category, TicketPriority? priority, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of tickets in year for ticket number generation.
    /// </summary>
    Task<int> GetCountForYearAsync(int year, CancellationToken ct = default);

    /// <summary>
    /// Adds a comment to a ticket thread.
    /// </summary>
    Task AddCommentAsync(HelpdeskTicketComment comment, CancellationToken ct = default);
}
