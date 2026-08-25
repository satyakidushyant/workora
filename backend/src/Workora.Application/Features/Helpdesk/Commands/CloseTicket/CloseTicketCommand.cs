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

/// <summary>
/// Handler for <see cref="CloseTicketCommand"/>.
/// </summary>
public class CloseTicketCommandHandler : IRequestHandler<CloseTicketCommand, ApiResponse<HelpdeskTicketDto>>
{
    private readonly IHelpdeskTicketRepository _ticketRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public CloseTicketCommandHandler(
        IHelpdeskTicketRepository ticketRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<HelpdeskTicketDto>> Handle(CloseTicketCommand request, CancellationToken ct)
    {
        var ticket = await _ticketRepository.GetByIdAsync(request.TicketId, ct);
        if (ticket == null)
        {
            return ApiResponse<HelpdeskTicketDto>.Fail("Ticket not found.");
        }

        ticket.Close();
        _ticketRepository.Update(ticket);
        await _unitOfWork.SaveChangesAsync(ct);

        var fullyLoaded = await _ticketRepository.GetWithCommentsAsync(ticket.Id, ct);
        var dto = _mapper.Map<HelpdeskTicketDto>(fullyLoaded ?? ticket);
        return ApiResponse<HelpdeskTicketDto>.Success(dto, "Ticket closed.");
    }
}
