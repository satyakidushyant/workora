using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Queries.ListExpenseClaims;

/// <summary>
/// Handler for <see cref="ListExpenseClaimsQuery"/>.
/// </summary>
public class ListExpenseClaimsQueryHandler : IRequestHandler<ListExpenseClaimsQuery, ApiResponse<PagedResponse<ExpenseClaimDto>>>
{
    private readonly IExpenseClaimRepository _expenseRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ListExpenseClaimsQueryHandler(
        IExpenseClaimRepository expenseRepository,
        ITenantResolutionService tenantResolutionService,
        IMapper mapper)
    {
        _expenseRepository = expenseRepository;
        _tenantResolutionService = tenantResolutionService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<ExpenseClaimDto>>> Handle(ListExpenseClaimsQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);
        var claims = await _expenseRepository.GetClaimsAsync(request.Status, request.Category, targetCompanyId, ct);
        var filtered = claims
            .Where(c => string.IsNullOrWhiteSpace(request.SearchTerm) ||
                        (c.MerchantName != null && c.MerchantName.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase)) ||
                        (c.Description != null && c.Description.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase)))
            .ToList();


        var totalCount = filtered.Count;
        var pagedClaims = filtered
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var dtos = _mapper.Map<IReadOnlyList<ExpenseClaimDto>>(pagedClaims);
        var pagedResponse = new PagedResponse<ExpenseClaimDto>(dtos, totalCount, request.PageNumber, request.PageSize);
        return ApiResponse<PagedResponse<ExpenseClaimDto>>.Success(pagedResponse);
    }
}

