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

/// <summary>
/// Validator for <see cref="ResolveTicketCommand"/>.
/// </summary>
public class ResolveTicketCommandValidator : AbstractValidator<ResolveTicketCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public ResolveTicketCommandValidator()
    {
        RuleFor(x => x.ResolutionNotes).NotEmpty().MaximumLength(2000).WithMessage("Resolution notes are required.");
    }
}

/// <summary>
/// Handler for <see cref="ResolveTicketCommand"/>.
/// </summary>
public class ResolveTicketCommandHandler : IRequestHandler<ResolveTicketCommand, ApiResponse<HelpdeskTicketDto>>
{
    private readonly IHelpdeskTicketRepository _ticketRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ResolveTicketCommandHandler(
        IHelpdeskTicketRepository ticketRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<HelpdeskTicketDto>> Handle(ResolveTicketCommand request, CancellationToken ct)
    {
        var ticket = await _ticketRepository.GetByIdAsync(request.TicketId, ct);
        if (ticket == null)
        {
            return ApiResponse<HelpdeskTicketDto>.Fail("Ticket not found.");
        }

        ticket.Resolve(request.ResolutionNotes);
        _ticketRepository.Update(ticket);
        await _unitOfWork.SaveChangesAsync(ct);

        var fullyLoaded = await _ticketRepository.GetWithCommentsAsync(ticket.Id, ct);
        var dto = _mapper.Map<HelpdeskTicketDto>(fullyLoaded ?? ticket);
        return ApiResponse<HelpdeskTicketDto>.Success(dto, "Ticket resolved successfully.");
    }
}
