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
public class ListCompanyLoansQueryHandler : IRequestHandler<ListCompanyLoansQuery, ApiResponse<List<LoanDto>>>
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
    public async Task<ApiResponse<List<LoanDto>>> Handle(ListCompanyLoansQuery request, CancellationToken ct)
    {
        var loans = await _loanRepository.GetCompanyLoansAsync(request.CompanyId, request.Status, ct);
        var dtos = _mapper.Map<List<LoanDto>>(loans);
        return ApiResponse<List<LoanDto>>.Success(dtos);
    }
}
