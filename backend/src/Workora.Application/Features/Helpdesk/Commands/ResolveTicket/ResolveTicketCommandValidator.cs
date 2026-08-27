using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Commands.ResolveTicket;

/// <summary>
/// Validator for <see cref="ResolveTicketCommand"/>.
/// </summary>
public class ResolveTicketCommandValidator : AbstractValidator<ResolveTicketCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public ResolveTicketCommandValidator()
    {
        RuleFor(x => x.ResolutionNotes).NotEmpty().MaximumLength(2000).WithMessage("Resolution notes are required.");
    }
}
