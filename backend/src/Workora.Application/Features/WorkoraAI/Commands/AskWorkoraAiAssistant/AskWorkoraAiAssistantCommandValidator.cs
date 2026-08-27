using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.WorkoraAI.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.WorkoraAI.Commands.AskWorkoraAiAssistant;

/// <summary>
/// Validator for <see cref="AskWorkoraAiAssistantCommand"/>.
/// </summary>
public class AskWorkoraAiAssistantCommandValidator : AbstractValidator<AskWorkoraAiAssistantCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public AskWorkoraAiAssistantCommandValidator()
    {
        RuleFor(x => x.Prompt).NotEmpty().MaximumLength(1000).WithMessage("Prompt cannot be empty.");
    }
}
