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
