using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.DTOs;

/// <summary>
/// Data transfer object for a helpdesk support ticket.
/// </summary>
public record HelpdeskTicketDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    string TicketNumber,
    int RaisedByEmployeeId,
    string? RaisedByEmployeeName,
    int? AssignedToEmployeeId,
    string? AssignedToEmployeeName,
    TicketCategory Category,
    string Subject,
    string Description,
    TicketPriority Priority,
    TicketStatus Status,
    DateTimeOffset? ResolvedAt,
    string? ResolutionNotes,
    List<TicketCommentDto>? Comments,
    DateTimeOffset CreatedAt);
