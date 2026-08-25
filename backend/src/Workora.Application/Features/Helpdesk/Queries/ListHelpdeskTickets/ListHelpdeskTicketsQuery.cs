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

/// <summary>
/// Handler for <see cref="ListHelpdeskTicketsQuery"/>.
/// </summary>
public class ListHelpdeskTicketsQueryHandler : IRequestHandler<ListHelpdeskTicketsQuery, ApiResponse<List<HelpdeskTicketDto>>>
{
    private readonly IHelpdeskTicketRepository _ticketRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ListHelpdeskTicketsQueryHandler(IHelpdeskTicketRepository ticketRepository, IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<List<HelpdeskTicketDto>>> Handle(ListHelpdeskTicketsQuery request, CancellationToken ct)
    {
        var tickets = await _ticketRepository.GetCompanyTicketsAsync(request.CompanyId, request.Status, request.Category, request.Priority, ct);
        var dtos = _mapper.Map<List<HelpdeskTicketDto>>(tickets);
        return ApiResponse<List<HelpdeskTicketDto>>.Success(dtos);
    }
}
