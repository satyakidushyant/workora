using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Exceptions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Commands.RejectExpenseClaim;

/// <summary>
/// Handler for <see cref="RejectExpenseClaimCommand"/>.
/// </summary>
public class RejectExpenseClaimCommandHandler : IRequestHandler<RejectExpenseClaimCommand, ApiResponse<ExpenseClaimDto>>
{
    private readonly IExpenseClaimRepository _expenseRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public RejectExpenseClaimCommandHandler(
        IExpenseClaimRepository expenseRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _expenseRepository = expenseRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<ExpenseClaimDto>> Handle(RejectExpenseClaimCommand request, CancellationToken ct)
    {
        var claim = await _expenseRepository.GetByIdAsync(request.ClaimId, ct);
        if (claim == null)
        {
            return ApiResponse<ExpenseClaimDto>.Fail("Expense claim not found.");
        }

        try
        {
            claim.Reject(request.ReviewerUserId, request.Reason);
            _expenseRepository.Update(claim);
            await _unitOfWork.SaveChangesAsync(ct);

            var dto = _mapper.Map<ExpenseClaimDto>(claim);
            return ApiResponse<ExpenseClaimDto>.Success(dto, "Expense claim rejected.");
        }
        catch (DomainException ex)
        {
            return ApiResponse<ExpenseClaimDto>.Fail(ex.Message);
        }
    }
}
