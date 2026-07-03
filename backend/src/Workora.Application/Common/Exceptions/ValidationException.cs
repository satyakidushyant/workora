using FluentValidation.Results;
using Workora.Shared.Responses;

namespace Workora.Application.Common.Exceptions;

/// <summary>
/// Custom exception for validation failures.
/// </summary>
public class ValidationException : Exception
{
    /// <summary>
    /// Gets the list of validation errors.
    /// </summary>
    public List<FieldError> Errors { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="ValidationException"/> class with a list of failures.
    /// </summary>
    /// <param name="failures">The collection of validation failures.</param>
    public ValidationException(IEnumerable<ValidationFailure> failures)
        : base("One or more validation failures have occurred.")
    {
        Errors = failures
            .Select(e => new FieldError(e.PropertyName, e.ErrorMessage))
            .ToList();
    }
}
