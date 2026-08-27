using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Queries.ListMyTickets;

/// <summary>
/// Handler for <see cref="ListMyTicketsQuery"/>.
/// </summary>
public class ListMyTicketsQueryHandler : IRequestHandler<ListMyTicketsQuery, ApiResponse<List<HelpdeskTicketDto>>>
{
    private readonly IHelpdeskTicketRepository _ticketRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ListMyTicketsQueryHandler(
        IHelpdeskTicketRepository ticketRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IEmployeeRepository employeeRepository,
        IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<List<HelpdeskTicketDto>>> Handle(ListMyTicketsQuery request, CancellationToken ct)
    {
        if (_currentUserService.UserId == null)
        {
            return ApiResponse<List<HelpdeskTicketDto>>.Fail("User context not found.");
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<List<HelpdeskTicketDto>>.Fail("User account not found.");
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<List<HelpdeskTicketDto>>.Fail("Authenticated user is not linked to an employee record.");
        }

        var tickets = await _ticketRepository.GetTicketsByEmployeeAsync(employee.Id, ct);
        var dtos = _mapper.Map<List<HelpdeskTicketDto>>(tickets);
        return ApiResponse<List<HelpdeskTicketDto>>.Success(dtos);
    }
}
