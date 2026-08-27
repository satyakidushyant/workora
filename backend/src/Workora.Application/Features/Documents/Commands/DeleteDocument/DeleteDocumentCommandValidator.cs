using FluentValidation;

using Workora.Application.Features.Documents.DTOs;
namespace Workora.Application.Features.Documents.Commands.DeleteDocument;

/// <summary>
/// Validator for <see cref="DeleteDocumentCommand"/>.
/// </summary>
public class DeleteDocumentCommandValidator : AbstractValidator<DeleteDocumentCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="DeleteDocumentCommand"/>.
    /// </summary>
    public DeleteDocumentCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
