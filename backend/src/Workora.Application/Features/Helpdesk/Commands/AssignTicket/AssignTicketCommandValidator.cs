using FluentValidation;

using Workora.Application.Features.Helpdesk.DTOs;
namespace Workora.Application.Features.Helpdesk.Commands.AssignTicket;

/// <summary>
/// Validator for <see cref="AssignTicketCommand"/>.
/// </summary>
public class AssignTicketCommandValidator : AbstractValidator<AssignTicketCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="AssignTicketCommand"/>.
    /// </summary>
    public AssignTicketCommandValidator()
    {
        RuleFor(x => x.TicketId).GreaterThan(0).WithMessage("Valid TicketId is required.");
        RuleFor(x => x.AssignedToEmployeeId).GreaterThan(0).WithMessage("Valid AssignedToEmployeeId is required.");
    }
}
