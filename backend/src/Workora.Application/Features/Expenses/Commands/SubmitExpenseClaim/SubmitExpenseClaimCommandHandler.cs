using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Commands.SubmitExpenseClaim;

/// <summary>
/// Handler for <see cref="SubmitExpenseClaimCommand"/>.
/// </summary>
public class SubmitExpenseClaimCommandHandler : IRequestHandler<SubmitExpenseClaimCommand, ApiResponse<ExpenseClaimDto>>
{
    private readonly IExpenseClaimRepository _expenseRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public SubmitExpenseClaimCommandHandler(
        IExpenseClaimRepository expenseRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _expenseRepository = expenseRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<ExpenseClaimDto>> Handle(SubmitExpenseClaimCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<ExpenseClaimDto>.Fail("Employee not found.");
        }

        var claim = ExpenseClaim.Create(
            request.EmployeeId,
            request.Category,
            request.ExpenseDate,
            request.Amount,
            request.MerchantName,
            request.Description,
            request.ReceiptUrl);

        await _expenseRepository.AddAsync(claim, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<ExpenseClaimDto>(claim);
        return ApiResponse<ExpenseClaimDto>.Success(dto, "Expense claim submitted successfully.");
    }
}
