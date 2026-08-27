using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Commands.CreateTicket;

/// <summary>
/// Command to raise a new support ticket.
/// </summary>
public record CreateTicketCommand(
    int CompanyId,
    int RaisedByEmployeeId,
    TicketCategory Category,
    string Subject,
    string Description,
    TicketPriority Priority) : IRequest<ApiResponse<HelpdeskTicketDto>>;
