using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Tasks.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Tasks.Commands.CreateTask;

/// <summary>
/// Validator for <see cref="CreateTaskCommand"/>.
/// </summary>
public class CreateTaskCommandValidator : AbstractValidator<CreateTaskCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public CreateTaskCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Task title is required.");
        RuleFor(x => x.AssignedToEmployeeId).GreaterThan(0).WithMessage("Valid assignee employee ID is required.");
        RuleFor(x => x.CreatedByEmployeeId).GreaterThan(0).WithMessage("Valid creator employee ID is required.");
    }
}
