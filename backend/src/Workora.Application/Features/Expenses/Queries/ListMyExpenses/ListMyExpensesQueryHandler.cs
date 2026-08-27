using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Queries.ListMyExpenses;

/// <summary>
/// Handler for <see cref="ListMyExpensesQuery"/>.
/// </summary>
public class ListMyExpensesQueryHandler : IRequestHandler<ListMyExpensesQuery, ApiResponse<List<ExpenseClaimDto>>>
{
    private readonly IExpenseClaimRepository _expenseRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ListMyExpensesQueryHandler(
        IExpenseClaimRepository expenseRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IEmployeeRepository employeeRepository,
        IMapper mapper)
    {
        _expenseRepository = expenseRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<List<ExpenseClaimDto>>> Handle(ListMyExpensesQuery request, CancellationToken ct)
    {
        if (_currentUserService.UserId == null)
        {
            return ApiResponse<List<ExpenseClaimDto>>.Fail("User context not found.");
        }

        var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
        if (user == null)
        {
            return ApiResponse<List<ExpenseClaimDto>>.Fail("User account not found.");
        }

        var employee = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
        if (employee == null)
        {
            return ApiResponse<List<ExpenseClaimDto>>.Fail("Authenticated user is not linked to an employee record.");
        }

        var claims = await _expenseRepository.GetByEmployeeIdAsync(employee.Id, ct);
        var dtos = _mapper.Map<List<ExpenseClaimDto>>(claims);
        return ApiResponse<List<ExpenseClaimDto>>.Success(dtos);
    }
}
