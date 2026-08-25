using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Exceptions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Commands.RejectLoan;

/// <summary>
/// Command to reject a loan application.
/// </summary>
public record RejectLoanCommand(int LoanId, int RejectedByUserId, string RejectionReason) : IRequest<ApiResponse<LoanDto>>;

/// <summary>
/// Validator for <see cref="RejectLoanCommand"/>.
/// </summary>
public class RejectLoanCommandValidator : AbstractValidator<RejectLoanCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public RejectLoanCommandValidator()
    {
        RuleFor(x => x.RejectionReason).NotEmpty().MaximumLength(500).WithMessage("Rejection reason is required.");
    }
}

/// <summary>
/// Handler for <see cref="RejectLoanCommand"/>.
/// </summary>
public class RejectLoanCommandHandler : IRequestHandler<RejectLoanCommand, ApiResponse<LoanDto>>
{
    private readonly ILoanRepository _loanRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public RejectLoanCommandHandler(
        ILoanRepository loanRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _loanRepository = loanRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<LoanDto>> Handle(RejectLoanCommand request, CancellationToken ct)
    {
        var loan = await _loanRepository.GetByIdAsync(request.LoanId, ct);
        if (loan == null)
        {
            return ApiResponse<LoanDto>.Fail("Loan record not found.");
        }

        try
        {
            loan.Reject(request.RejectedByUserId, request.RejectionReason);
            _loanRepository.Update(loan);
            await _unitOfWork.SaveChangesAsync(ct);

            var dto = _mapper.Map<LoanDto>(loan);
            return ApiResponse<LoanDto>.Success(dto, "Loan application rejected.");
        }
        catch (DomainException ex)
        {
            return ApiResponse<LoanDto>.Fail(ex.Message);
        }
    }
}
