using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Commands.AssignTicket;

/// <summary>
/// Command to assign a helpdesk ticket to a support staff member.
/// </summary>
public record AssignTicketCommand(int TicketId, int AssignedToEmployeeId) : IRequest<ApiResponse<HelpdeskTicketDto>>;
