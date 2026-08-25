using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Queries.ListMyLoans;

/// <summary>
/// Query to list active and past loans for the currently authenticated employee.
/// </summary>
public record ListMyLoansQuery : IRequest<ApiResponse<List<LoanDto>>>;

/// <summary>
/// Handler for <see cref="ListMyLoansQuery"/>.
/// </summary>
public class ListMyLoansQueryHandler : IRequestHandler<ListMyLoansQuery, ApiResponse<List<LoanDto>>>
{
    private readonly ILoanRepository _loanRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ListMyLoansQueryHandler(
        ILoanRepository loanRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IEmployeeRepository employeeRepository,
        IMapper mapper)
    {
        _loanRepository = loanRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<List<LoanDto>>> Handle(ListMyLoansQuery request, CancellationToken ct)
    {
        if (_currentUserService.UserId == null)
        {
            return ApiResponse<List<LoanDto>>.Fail("User context not found.");
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<List<LoanDto>>.Fail("User account not found.");
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<List<LoanDto>>.Fail("Authenticated user is not linked to an employee record.");
        }

        var loans = await _loanRepository.GetByEmployeeIdAsync(employee.Id, ct);
        var dtos = _mapper.Map<List<LoanDto>>(loans);
        return ApiResponse<List<LoanDto>>.Success(dtos);
    }
}
