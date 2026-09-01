using AutoMapper;
using MediatR;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Queries.ListCompanyLoans;

/// <summary>
/// Handler for <see cref="ListCompanyLoansQuery"/>.
/// </summary>
public class ListCompanyLoansQueryHandler : IRequestHandler<ListCompanyLoansQuery, ApiResponse<PagedResponse<LoanDto>>>
{
    private readonly ILoanRepository _loanRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ListCompanyLoansQueryHandler(ILoanRepository loanRepository, IMapper mapper)
    {
        _loanRepository = loanRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<LoanDto>>> Handle(ListCompanyLoansQuery request, CancellationToken ct)
    {
        var loans = await _loanRepository.GetCompanyLoansAsync(request.CompanyId, request.Status, ct);
        var filtered = loans
            .Where(l => string.IsNullOrWhiteSpace(request.SearchTerm) ||
                        l.Reason.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase))
            .ToList();

        var totalCount = filtered.Count;
        var pagedLoans = filtered
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var dtos = _mapper.Map<IReadOnlyList<LoanDto>>(pagedLoans);
        var pagedResponse = new PagedResponse<LoanDto>(dtos, totalCount, request.PageNumber, request.PageSize);
        return ApiResponse<PagedResponse<LoanDto>>.Success(pagedResponse);
    }
}

