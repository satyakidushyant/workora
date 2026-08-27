using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Commands.AssignTicket;

/// <summary>
/// Handler for <see cref="AssignTicketCommand"/>.
/// </summary>
public class AssignTicketCommandHandler : IRequestHandler<AssignTicketCommand, ApiResponse<HelpdeskTicketDto>>
{
    private readonly IHelpdeskTicketRepository _ticketRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public AssignTicketCommandHandler(
        IHelpdeskTicketRepository ticketRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<HelpdeskTicketDto>> Handle(AssignTicketCommand request, CancellationToken ct)
    {
        var ticket = await _ticketRepository.GetByIdAsync(request.TicketId, ct);
        if (ticket == null)
        {
            return ApiResponse<HelpdeskTicketDto>.Fail("Ticket not found.");
        }

        var assignee = await _employeeRepository.GetByIdAsync(request.AssignedToEmployeeId, ct);
        if (assignee == null)
        {
            return ApiResponse<HelpdeskTicketDto>.Fail("Assignee employee not found.");
        }

        ticket.Assign(request.AssignedToEmployeeId);
        _ticketRepository.Update(ticket);
        await _unitOfWork.SaveChangesAsync(ct);

        var fullyLoaded = await _ticketRepository.GetWithCommentsAsync(ticket.Id, ct);
        var dto = _mapper.Map<HelpdeskTicketDto>(fullyLoaded ?? ticket);
        return ApiResponse<HelpdeskTicketDto>.Success(dto, "Ticket assigned successfully.");
    }
}
