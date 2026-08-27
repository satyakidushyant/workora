using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Commands.ResolveTicket;

/// <summary>
/// Command to mark a helpdesk ticket as resolved with resolution notes.
/// </summary>
public record ResolveTicketCommand(int TicketId, string ResolutionNotes) : IRequest<ApiResponse<HelpdeskTicketDto>>;
