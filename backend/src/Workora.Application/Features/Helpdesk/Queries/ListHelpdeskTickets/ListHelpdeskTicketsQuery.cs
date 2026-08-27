using AutoMapper;
using MediatR;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Queries.ListHelpdeskTickets;

/// <summary>
/// Query to list company helpdesk tickets with filtering options.
/// </summary>
public record ListHelpdeskTicketsQuery(
    int? CompanyId,
    TicketStatus? Status,
    TicketCategory? Category,
    TicketPriority? Priority) : IRequest<ApiResponse<List<HelpdeskTicketDto>>>;
