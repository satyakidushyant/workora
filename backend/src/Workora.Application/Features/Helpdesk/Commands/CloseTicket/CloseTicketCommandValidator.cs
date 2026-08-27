using FluentValidation;

using Workora.Application.Features.Helpdesk.DTOs;
namespace Workora.Application.Features.Helpdesk.Commands.CloseTicket;

/// <summary>
/// Validator for <see cref="CloseTicketCommand"/>.
/// </summary>
public class CloseTicketCommandValidator : AbstractValidator<CloseTicketCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CloseTicketCommand"/>.
    /// </summary>
    public CloseTicketCommandValidator()
    {
        RuleFor(x => x.TicketId).GreaterThan(0).WithMessage("Valid TicketId is required.");
    }
}
