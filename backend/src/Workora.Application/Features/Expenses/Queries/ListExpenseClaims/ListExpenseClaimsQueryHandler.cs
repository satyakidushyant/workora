using AutoMapper;
using MediatR;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Queries.ListExpenseClaims;

/// <summary>
/// Handler for <see cref="ListExpenseClaimsQuery"/>.
/// </summary>
public class ListExpenseClaimsQueryHandler : IRequestHandler<ListExpenseClaimsQuery, ApiResponse<List<ExpenseClaimDto>>>
{
    private readonly IExpenseClaimRepository _expenseRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ListExpenseClaimsQueryHandler(IExpenseClaimRepository expenseRepository, IMapper mapper)
    {
        _expenseRepository = expenseRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<List<ExpenseClaimDto>>> Handle(ListExpenseClaimsQuery request, CancellationToken ct)
    {
        var claims = await _expenseRepository.GetClaimsAsync(request.Status, request.Category, ct);
        var dtos = _mapper.Map<List<ExpenseClaimDto>>(claims);
        return ApiResponse<List<ExpenseClaimDto>>.Success(dtos);
    }
}
