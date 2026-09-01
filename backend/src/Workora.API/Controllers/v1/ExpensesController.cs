using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Expenses.Commands.ApproveExpenseClaim;
using Workora.Application.Features.Expenses.Commands.RejectExpenseClaim;
using Workora.Application.Features.Expenses.Commands.SubmitExpenseClaim;
using Workora.Application.Features.Expenses.DTOs;
using Workora.Application.Features.Expenses.Queries.GetExpenseClaimById;
using Workora.Application.Features.Expenses.Queries.ListExpenseClaims;
using Workora.Application.Features.Expenses.Queries.ListMyExpenses;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing employee expense reimbursement claims.
/// </summary>
[ApiController]
[Route("api/v1/expenses")]
public class ExpensesController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="ExpensesController"/> class.
    /// </summary>
    public ExpensesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lists company expense claims with dynamic pagination and optional status/category filters.
    /// </summary>
    [HttpGet]
    [Authorize(Policy = "expenses.view")]
    public async Task<ApiResponse<PagedResponse<ExpenseClaimDto>>> GetExpenseClaims([FromQuery] ListExpenseClaimsQuery query)
        => await _mediator.Send(query);


    /// <summary>
    /// Gets all claims submitted by the currently authenticated employee.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ApiResponse<List<ExpenseClaimDto>>> GetMyExpenses()
        => await _mediator.Send(new ListMyExpensesQuery());

    /// <summary>
    /// Gets specific expense claim by ID.
    /// </summary>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "expenses.view")]
    public async Task<ApiResponse<ExpenseClaimDto>> GetExpenseClaimById(int id)
        => await _mediator.Send(new GetExpenseClaimByIdQuery(id));

    /// <summary>
    /// Submits a new expense claim with bill proof.
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "expenses.submit")]
    public async Task<ApiResponse<ExpenseClaimDto>> SubmitExpenseClaim([FromBody] SubmitExpenseClaimCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Reporting manager approves an expense claim.
    /// </summary>
    [HttpPatch("{id:int}/approve-manager")]
    [Authorize(Policy = "expenses.approve")]
    public async Task<ApiResponse<ExpenseClaimDto>> ApproveByManager(int id, [FromBody] int managerUserId)
        => await _mediator.Send(new ApproveExpenseClaimCommand(id, managerUserId, IsFinanceApproval: false));

    /// <summary>
    /// Finance team approves an expense claim for reimbursement.
    /// </summary>
    [HttpPatch("{id:int}/approve-finance")]
    [Authorize(Policy = "expenses.finance")]
    public async Task<ApiResponse<ExpenseClaimDto>> ApproveByFinance(int id, [FromBody] int financeUserId)
        => await _mediator.Send(new ApproveExpenseClaimCommand(id, financeUserId, IsFinanceApproval: true));

    /// <summary>
    /// Rejects an expense claim.
    /// </summary>
    [HttpPatch("{id:int}/reject")]
    [Authorize(Policy = "expenses.approve")]
    public async Task<ApiResponse<ExpenseClaimDto>> RejectExpenseClaim(int id, [FromBody] RejectExpensePayload payload)
        => await _mediator.Send(new RejectExpenseClaimCommand(id, payload.ReviewerUserId, payload.Reason));
}

/// <summary>
/// Payload for rejecting an expense claim.
/// </summary>
public record RejectExpensePayload(int ReviewerUserId, string Reason);
