using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Commands.CloseTicket;

/// <summary>
/// Command to close a resolved ticket.
/// </summary>
public record CloseTicketCommand(int TicketId) : IRequest<ApiResponse<HelpdeskTicketDto>>;
