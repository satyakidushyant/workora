using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Queries.ListHelpdeskTickets;

/// <summary>
/// Query to list company helpdesk tickets with dynamic pagination and filtering.
/// </summary>
public record ListHelpdeskTicketsQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<HelpdeskTicketDto>>>
{
    /// <summary>
    /// Gets or init optional filter for company ID.
    /// </summary>
    public int? CompanyId { get; init; }

    /// <summary>
    /// Gets or init optional filter for ticket status.
    /// </summary>
    public TicketStatus? Status { get; init; }

    /// <summary>
    /// Gets or init optional filter for ticket category.
    /// </summary>
    public TicketCategory? Category { get; init; }

    /// <summary>
    /// Gets or init optional filter for ticket priority.
    /// </summary>
    public TicketPriority? Priority { get; init; }
}

