using FluentValidation;

using Workora.Application.Features.Recruitment.DTOs;
namespace Workora.Application.Features.Recruitment.Commands.PublishJobPosting;

/// <summary>
/// Validator for <see cref="PublishJobPostingCommand"/>.
/// </summary>
public class PublishJobPostingCommandValidator : AbstractValidator<PublishJobPostingCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="PublishJobPostingCommand"/>.
    /// </summary>
    public PublishJobPostingCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
