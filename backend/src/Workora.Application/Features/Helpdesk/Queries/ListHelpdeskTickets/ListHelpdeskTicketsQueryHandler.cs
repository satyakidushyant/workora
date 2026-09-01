using AutoMapper;
using MediatR;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Queries.ListHelpdeskTickets;

/// <summary>
/// Handler for <see cref="ListHelpdeskTicketsQuery"/>.
/// </summary>
public class ListHelpdeskTicketsQueryHandler : IRequestHandler<ListHelpdeskTicketsQuery, ApiResponse<PagedResponse<HelpdeskTicketDto>>>
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
    public async Task<ApiResponse<PagedResponse<HelpdeskTicketDto>>> Handle(ListHelpdeskTicketsQuery request, CancellationToken ct)
    {
        var tickets = await _ticketRepository.GetCompanyTicketsAsync(request.CompanyId, request.Status, request.Category, request.Priority, ct);
        var filtered = tickets
            .Where(t => string.IsNullOrWhiteSpace(request.SearchTerm) ||
                        t.Subject.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                        t.TicketNumber.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                        t.Description.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase))
            .ToList();

        var totalCount = filtered.Count;
        var pagedTickets = filtered
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var dtos = _mapper.Map<IReadOnlyList<HelpdeskTicketDto>>(pagedTickets);
        var pagedResponse = new PagedResponse<HelpdeskTicketDto>(dtos, totalCount, request.PageNumber, request.PageSize);
        return ApiResponse<PagedResponse<HelpdeskTicketDto>>.Success(pagedResponse);
    }
}

