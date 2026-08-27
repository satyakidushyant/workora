using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Helpdesk.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.Commands.AddTicketComment;

/// <summary>
/// Validator for <see cref="AddTicketCommentCommand"/>.
/// </summary>
public class AddTicketCommentCommandValidator : AbstractValidator<AddTicketCommentCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public AddTicketCommentCommandValidator()
    {
        RuleFor(x => x.TicketId).GreaterThan(0).WithMessage("Valid ticket ID is required.");
        RuleFor(x => x.CommentText).NotEmpty().MaximumLength(2000).WithMessage("Comment text is required.");
    }
}
