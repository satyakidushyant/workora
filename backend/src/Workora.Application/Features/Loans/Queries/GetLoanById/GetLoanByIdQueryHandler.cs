using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Queries.GetLoanById;

/// <summary>
/// Handler for <see cref="GetLoanByIdQuery"/>.
/// </summary>
public class GetLoanByIdQueryHandler : IRequestHandler<GetLoanByIdQuery, ApiResponse<LoanDto>>
{
    private readonly ILoanRepository _loanRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public GetLoanByIdQueryHandler(ILoanRepository loanRepository, IMapper mapper)
    {
        _loanRepository = loanRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<LoanDto>> Handle(GetLoanByIdQuery request, CancellationToken ct)
    {
        var loan = await _loanRepository.GetWithSchedulesAsync(request.LoanId, ct);
        if (loan == null)
        {
            return ApiResponse<LoanDto>.Fail(ResponseMessage.LoanNotFound.GetDescription());
        }

        var dto = _mapper.Map<LoanDto>(loan);
        return ApiResponse<LoanDto>.Success(dto);
    }
}
