using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Queries.GetLoanEmiSchedule;

/// <summary>
/// Handler for <see cref="GetLoanEmiScheduleQuery"/>.
/// </summary>
public class GetLoanEmiScheduleQueryHandler : IRequestHandler<GetLoanEmiScheduleQuery, ApiResponse<List<LoanEmiScheduleDto>>>
{
    private readonly ILoanRepository _loanRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public GetLoanEmiScheduleQueryHandler(ILoanRepository loanRepository, IMapper mapper)
    {
        _loanRepository = loanRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<List<LoanEmiScheduleDto>>> Handle(GetLoanEmiScheduleQuery request, CancellationToken ct)
    {
        var loan = await _loanRepository.GetWithSchedulesAsync(request.LoanId, ct);
        if (loan == null)
        {
            return ApiResponse<List<LoanEmiScheduleDto>>.Fail(ResponseMessage.LoanNotFound.GetDescription());
        }

        var dtos = _mapper.Map<List<LoanEmiScheduleDto>>(loan.EmiSchedules);
        return ApiResponse<List<LoanEmiScheduleDto>>.Success(dtos);
    }
}
