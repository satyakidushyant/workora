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
/// Handler for <see cref="CreateTicketCommand"/>.
/// </summary>
public class CreateTicketCommandHandler : IRequestHandler<CreateTicketCommand, ApiResponse<HelpdeskTicketDto>>
{
    private readonly IHelpdeskTicketRepository _ticketRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public CreateTicketCommandHandler(
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
    public async Task<ApiResponse<HelpdeskTicketDto>> Handle(CreateTicketCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.RaisedByEmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<HelpdeskTicketDto>.Fail("Employee not found.");
        }

        var year = DateTimeOffset.UtcNow.Year;
        var seq = await _ticketRepository.GetCountForYearAsync(year, ct) + 1;
        var ticketNumber = $"TKT-{year}-{seq:D4}";

        var ticket = HelpdeskTicket.Create(
            request.CompanyId,
            ticketNumber,
            request.RaisedByEmployeeId,
            request.Category,
            request.Subject,
            request.Description,
            request.Priority);

        await _ticketRepository.AddAsync(ticket, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<HelpdeskTicketDto>(ticket);
        return ApiResponse<HelpdeskTicketDto>.Success(dto, "Ticket created successfully.");
    }
}
