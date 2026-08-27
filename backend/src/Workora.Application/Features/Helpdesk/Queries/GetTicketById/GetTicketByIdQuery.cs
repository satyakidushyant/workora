using AutoMapper;
using MediatR;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Queries.GetTicketById;

/// <summary>
/// Query to get ticket details with discussion comments.
/// </summary>
public record GetTicketByIdQuery(int TicketId) : IRequest<ApiResponse<HelpdeskTicketDto>>;
