using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Loans.Commands.ApplyForLoan;
using Workora.Application.Features.Loans.Commands.ApproveLoan;
using Workora.Application.Features.Loans.Commands.RejectLoan;
using Workora.Application.Features.Loans.DTOs;
using Workora.Application.Features.Loans.Queries.GetLoanById;
using Workora.Application.Features.Loans.Queries.GetLoanEmiSchedule;
using Workora.Application.Features.Loans.Queries.ListCompanyLoans;
using Workora.Application.Features.Loans.Queries.ListMyLoans;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for managing employee loans, salary advances, and EMI deductions.
/// </summary>
[ApiController]
[Route("api/v1/loans")]
public class LoansController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="LoansController"/> class.
    /// </summary>
    public LoansController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lists all company loans with optional filtering.
    /// </summary>
    [HttpGet]
    [Authorize(Policy = "loans.view")]
    public async Task<ApiResponse<List<LoanDto>>> GetCompanyLoans([FromQuery] int? companyId, [FromQuery] LoanStatus? status)
        => await _mediator.Send(new ListCompanyLoansQuery(companyId, status));

    /// <summary>
    /// Gets all active and past loans for the currently authenticated employee.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ApiResponse<List<LoanDto>>> GetMyLoans()
        => await _mediator.Send(new ListMyLoansQuery());

    /// <summary>
    /// Gets a specific loan by ID.
    /// </summary>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "loans.view")]
    public async Task<ApiResponse<LoanDto>> GetLoanById(int id)
        => await _mediator.Send(new GetLoanByIdQuery(id));

    /// <summary>
    /// Gets the scheduled monthly EMI amortization list for a loan.
    /// </summary>
    [HttpGet("{id:int}/schedule")]
    [Authorize(Policy = "loans.view")]
    public async Task<ApiResponse<List<LoanEmiScheduleDto>>> GetLoanSchedule(int id)
        => await _mediator.Send(new GetLoanEmiScheduleQuery(id));

    /// <summary>
    /// Submits a new loan or advance application.
    /// </summary>
    [HttpPost("apply")]
    [Authorize(Policy = "loans.apply")]
    public async Task<ApiResponse<LoanDto>> ApplyForLoan([FromBody] ApplyForLoanCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Approves a loan application and activates its EMI schedule.
    /// </summary>
    [HttpPatch("{id:int}/approve")]
    [Authorize(Policy = "loans.approve")]
    public async Task<ApiResponse<LoanDto>> ApproveLoan(int id, [FromBody] int approvedByUserId)
        => await _mediator.Send(new ApproveLoanCommand(id, approvedByUserId));

    /// <summary>
    /// Rejects a loan application.
    /// </summary>
    [HttpPatch("{id:int}/reject")]
    [Authorize(Policy = "loans.approve")]
    public async Task<ApiResponse<LoanDto>> RejectLoan(int id, [FromBody] RejectLoanPayload payload)
        => await _mediator.Send(new RejectLoanCommand(id, payload.RejectedByUserId, payload.RejectionReason));
}

/// <summary>
/// Payload for rejecting a loan.
/// </summary>
public record RejectLoanPayload(int RejectedByUserId, string RejectionReason);
