using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Commands.CreateTicket;

/// <summary>
/// Validator for <see cref="CreateTicketCommand"/>.
/// </summary>
public class CreateTicketCommandValidator : AbstractValidator<CreateTicketCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public CreateTicketCommandValidator()
    {
        RuleFor(x => x.RaisedByEmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.Subject).NotEmpty().MaximumLength(200).WithMessage("Subject is required.");
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000).WithMessage("Description is required.");
    }
}
