using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Commands.ApplyForLoan;

/// <summary>
/// Command to apply for a loan or salary advance.
/// </summary>
public record ApplyForLoanCommand(
    int EmployeeId,
    LoanType LoanType,
    decimal PrincipalAmount,
    int TenureMonths,
    string Reason,
    DateOnly DisbursementDate) : IRequest<ApiResponse<LoanDto>>;

/// <summary>
/// Validator for <see cref="ApplyForLoanCommand"/>.
/// </summary>
public class ApplyForLoanCommandValidator : AbstractValidator<ApplyForLoanCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public ApplyForLoanCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid EmployeeId is required.");
        RuleFor(x => x.PrincipalAmount).GreaterThan(0).WithMessage("Principal amount must be greater than zero.");
        RuleFor(x => x.TenureMonths).InclusiveBetween(1, 60).WithMessage("Tenure months must be between 1 and 60.");
        RuleFor(x => x.Reason).NotEmpty().MaximumLength(500).WithMessage("Reason for loan is required.");
    }
}

/// <summary>
/// Handler for <see cref="ApplyForLoanCommand"/>.
/// </summary>
public class ApplyForLoanCommandHandler : IRequestHandler<ApplyForLoanCommand, ApiResponse<LoanDto>>
{
    private readonly ILoanRepository _loanRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ApplyForLoanCommandHandler(
        ILoanRepository loanRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _loanRepository = loanRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<LoanDto>> Handle(ApplyForLoanCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<LoanDto>.Fail("Employee not found.");
        }

        var loan = LoanRecord.Create(
            request.EmployeeId,
            request.LoanType,
            request.PrincipalAmount,
            request.TenureMonths,
            request.Reason,
            request.DisbursementDate);

        await _loanRepository.AddAsync(loan, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<LoanDto>(loan);
        return ApiResponse<LoanDto>.Success(dto, "Loan application submitted successfully.");
    }
}
