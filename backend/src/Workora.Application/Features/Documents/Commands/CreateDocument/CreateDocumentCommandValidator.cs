using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Documents.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Commands.CreateDocument;

/// <summary>
/// Validator for <see cref="CreateDocumentCommand"/>.
/// </summary>
public class CreateDocumentCommandValidator : AbstractValidator<CreateDocumentCommand>
{
    /// <summary>
    /// Initializes validation rules for document registration.
    /// </summary>
    public CreateDocumentCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Title is required.");
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(255).WithMessage("File name is required.");
        RuleFor(x => x.FilePath).NotEmpty().MaximumLength(500).WithMessage("File path is required.");
        RuleFor(x => x.ContentType).NotEmpty().MaximumLength(100).WithMessage("Content type is required.");
    }
}
