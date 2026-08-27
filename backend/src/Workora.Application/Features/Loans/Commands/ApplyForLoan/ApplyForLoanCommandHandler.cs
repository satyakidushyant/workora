using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Loans.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Loans.Commands.ApplyForLoan;

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
            return ApiResponse<LoanDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
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
        return ApiResponse<LoanDto>.Success(dto, ResponseMessage.LoanApplied.GetDescription());
    }
}
