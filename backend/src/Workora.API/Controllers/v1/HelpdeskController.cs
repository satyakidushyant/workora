using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Helpdesk.Commands.AddTicketComment;
using Workora.Application.Features.Helpdesk.Commands.AssignTicket;
using Workora.Application.Features.Helpdesk.Commands.CloseTicket;
using Workora.Application.Features.Helpdesk.Commands.CreateTicket;
using Workora.Application.Features.Helpdesk.Commands.ResolveTicket;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Application.Features.Helpdesk.Queries.GetTicketById;
using Workora.Application.Features.Helpdesk.Queries.ListHelpdeskTickets;
using Workora.Application.Features.Helpdesk.Queries.ListMyTickets;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing HR, payroll, and IT support helpdesk tickets.
/// </summary>
[ApiController]
[Route("api/v1/helpdesk")]
public class HelpdeskController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="HelpdeskController"/> class.
    /// </summary>
    public HelpdeskController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lists company support tickets with filtering options.
    /// </summary>
    [HttpGet]
    [Authorize(Policy = "helpdesk.view")]
    public async Task<ApiResponse<List<HelpdeskTicketDto>>> GetTickets(
        [FromQuery] int? companyId,
        [FromQuery] TicketStatus? status,
        [FromQuery] TicketCategory? category,
        [FromQuery] TicketPriority? priority)
        => await _mediator.Send(new ListHelpdeskTicketsQuery(companyId, status, category, priority));

    /// <summary>
    /// Gets tickets raised by the currently authenticated employee.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ApiResponse<List<HelpdeskTicketDto>>> GetMyTickets()
        => await _mediator.Send(new ListMyTicketsQuery());

    /// <summary>
    /// Gets specific ticket with conversation comments.
    /// </summary>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "helpdesk.view")]
    public async Task<ApiResponse<HelpdeskTicketDto>> GetTicketById(int id)
        => await _mediator.Send(new GetTicketByIdQuery(id));

    /// <summary>
    /// Raises a new support ticket.
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "helpdesk.create")]
    public async Task<ApiResponse<HelpdeskTicketDto>> CreateTicket([FromBody] CreateTicketCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Assigns a ticket to a support agent.
    /// </summary>
    [HttpPatch("{id:int}/assign")]
    [Authorize(Policy = "helpdesk.manage")]
    public async Task<ApiResponse<HelpdeskTicketDto>> AssignTicket(int id, [FromBody] int assignedToEmployeeId)
        => await _mediator.Send(new AssignTicketCommand(id, assignedToEmployeeId));

    /// <summary>
    /// Resolves a ticket with explanation notes.
    /// </summary>
    [HttpPatch("{id:int}/resolve")]
    [Authorize(Policy = "helpdesk.manage")]
    public async Task<ApiResponse<HelpdeskTicketDto>> ResolveTicket(int id, [FromBody] ResolveTicketPayload payload)
        => await _mediator.Send(new ResolveTicketCommand(id, payload.ResolutionNotes));

    /// <summary>
    /// Closes a resolved ticket.
    /// </summary>
    [HttpPatch("{id:int}/close")]
    [Authorize]
    public async Task<ApiResponse<HelpdeskTicketDto>> CloseTicket(int id)
        => await _mediator.Send(new CloseTicketCommand(id));

    /// <summary>
    /// Adds a comment or reply to the ticket thread.
    /// </summary>
    [HttpPost("{id:int}/comments")]
    [Authorize]
    public async Task<ApiResponse<TicketCommentDto>> AddComment(int id, [FromBody] AddCommentPayload payload)
        => await _mediator.Send(new AddTicketCommentCommand(id, payload.UserId, payload.CommentText, payload.AttachmentUrl, payload.IsInternalOnly));
}

/// <summary>
/// Payload for resolving a ticket.
/// </summary>
public record ResolveTicketPayload(string ResolutionNotes);

/// <summary>
/// Payload for posting a ticket comment.
/// </summary>
public record AddCommentPayload(int UserId, string CommentText, string? AttachmentUrl, bool IsInternalOnly);
