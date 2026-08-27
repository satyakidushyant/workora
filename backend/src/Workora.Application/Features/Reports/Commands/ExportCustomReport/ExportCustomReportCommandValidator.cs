using FluentValidation;

using Workora.Application.Features.Reports.DTOs;
namespace Workora.Application.Features.Reports.Commands.ExportCustomReport;

/// <summary>
/// Validator for <see cref="ExportCustomReportCommand"/>.
/// </summary>
public class ExportCustomReportCommandValidator : AbstractValidator<ExportCustomReportCommand>
{
    /// <summary>
    /// Initializes validation rules for ExportCustomReportCommand.
    /// </summary>
    public ExportCustomReportCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.ReportType).NotEmpty().WithMessage("Report type is required.");
    }
}
