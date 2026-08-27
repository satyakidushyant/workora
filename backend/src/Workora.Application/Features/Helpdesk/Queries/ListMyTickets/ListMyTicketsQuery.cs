using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Queries.ListMyTickets;

/// <summary>
/// Query to list tickets raised by the currently authenticated employee.
/// </summary>
public record ListMyTicketsQuery : IRequest<ApiResponse<List<HelpdeskTicketDto>>>;
