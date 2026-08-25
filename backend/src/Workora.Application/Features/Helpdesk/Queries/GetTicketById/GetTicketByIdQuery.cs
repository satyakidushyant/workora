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

/// <summary>
/// Handler for <see cref="GetTicketByIdQuery"/>.
/// </summary>
public class GetTicketByIdQueryHandler : IRequestHandler<GetTicketByIdQuery, ApiResponse<HelpdeskTicketDto>>
{
    private readonly IHelpdeskTicketRepository _ticketRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public GetTicketByIdQueryHandler(IHelpdeskTicketRepository ticketRepository, IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<HelpdeskTicketDto>> Handle(GetTicketByIdQuery request, CancellationToken ct)
    {
        var ticket = await _ticketRepository.GetWithCommentsAsync(request.TicketId, ct);
        if (ticket == null)
        {
            return ApiResponse<HelpdeskTicketDto>.Fail("Ticket not found.");
        }

        var dto = _mapper.Map<HelpdeskTicketDto>(ticket);
        return ApiResponse<HelpdeskTicketDto>.Success(dto);
    }
}
