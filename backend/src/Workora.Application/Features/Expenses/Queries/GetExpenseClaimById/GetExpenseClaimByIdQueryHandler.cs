using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Queries.GetExpenseClaimById;

/// <summary>
/// Handler for <see cref="GetExpenseClaimByIdQuery"/>.
/// </summary>
public class GetExpenseClaimByIdQueryHandler : IRequestHandler<GetExpenseClaimByIdQuery, ApiResponse<ExpenseClaimDto>>
{
    private readonly IExpenseClaimRepository _expenseRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public GetExpenseClaimByIdQueryHandler(IExpenseClaimRepository expenseRepository, IMapper mapper)
    {
        _expenseRepository = expenseRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<ExpenseClaimDto>> Handle(GetExpenseClaimByIdQuery request, CancellationToken ct)
    {
        var claim = await _expenseRepository.GetByIdAsync(request.ClaimId, ct);
        if (claim == null)
        {
            return ApiResponse<ExpenseClaimDto>.Fail(ResponseMessage.ExpenseClaimNotFound.GetDescription());
        }

        var dto = _mapper.Map<ExpenseClaimDto>(claim);
        return ApiResponse<ExpenseClaimDto>.Success(dto);
    }
}
