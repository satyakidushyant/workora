using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Exceptions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Commands.ApproveLoan;

/// <summary>
/// Command to approve a loan and generate EMI schedules.
/// </summary>
public record ApproveLoanCommand(int LoanId, int ApprovedByUserId) : IRequest<ApiResponse<LoanDto>>;

/// <summary>
/// Handler for <see cref="ApproveLoanCommand"/>.
/// </summary>
public class ApproveLoanCommandHandler : IRequestHandler<ApproveLoanCommand, ApiResponse<LoanDto>>
{
    private readonly ILoanRepository _loanRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ApproveLoanCommandHandler(
        ILoanRepository loanRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _loanRepository = loanRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<LoanDto>> Handle(ApproveLoanCommand request, CancellationToken ct)
    {
        var loan = await _loanRepository.GetWithSchedulesAsync(request.LoanId, ct);
        if (loan == null)
        {
            return ApiResponse<LoanDto>.Fail("Loan record not found.");
        }

        try
        {
            loan.Approve(request.ApprovedByUserId);
            _loanRepository.Update(loan);
            await _unitOfWork.SaveChangesAsync(ct);

            var dto = _mapper.Map<LoanDto>(loan);
            return ApiResponse<LoanDto>.Success(dto, "Loan approved and EMI schedule generated successfully.");
        }
        catch (DomainException ex)
        {
            return ApiResponse<LoanDto>.Fail(ex.Message);
        }
    }
}
