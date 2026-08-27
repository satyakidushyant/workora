using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Domain.Exceptions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Expenses.Commands.ApproveExpenseClaim;

/// <summary>
/// Handler for <see cref="ApproveExpenseClaimCommand"/>.
/// </summary>
public class ApproveExpenseClaimCommandHandler : IRequestHandler<ApproveExpenseClaimCommand, ApiResponse<ExpenseClaimDto>>
{
    private readonly IExpenseClaimRepository _expenseRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ApproveExpenseClaimCommandHandler(
        IExpenseClaimRepository expenseRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _expenseRepository = expenseRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<ExpenseClaimDto>> Handle(ApproveExpenseClaimCommand request, CancellationToken ct)
    {
        var claim = await _expenseRepository.GetByIdAsync(request.ClaimId, ct);
        if (claim == null)
        {
            return ApiResponse<ExpenseClaimDto>.Fail(ResponseMessage.ExpenseClaimNotFound.GetDescription());
        }

        try
        {
            if (request.IsFinanceApproval)
            {
                claim.ApproveByFinance(request.ApproverUserId);
            }
            else
            {
                claim.ApproveByManager(request.ApproverUserId);
            }

            _expenseRepository.Update(claim);
            await _unitOfWork.SaveChangesAsync(ct);

            var dto = _mapper.Map<ExpenseClaimDto>(claim);
            return ApiResponse<ExpenseClaimDto>.Success(dto, ResponseMessage.ExpenseClaimApproved.GetDescription());
        }
        catch (DomainException ex)
        {
            return ApiResponse<ExpenseClaimDto>.Fail(ex.Message);
        }
    }
}
