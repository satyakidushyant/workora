using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.Commands.DeclareTaxInvestment;

/// <summary>
/// Command to declare tax saving investments under Sections 80C, 80D, HRA, etc.
/// </summary>
public record DeclareTaxInvestmentCommand(
    int EmployeeId,
    string FinancialYear,
    decimal Section80CAmount,
    decimal Section80DAmount,
    decimal HraRentPaidAnnual,
    decimal HomeLoanInterest,
    decimal OtherExemptions) : IRequest<ApiResponse<TaxDeclarationDto>>;

/// <summary>
/// Validator for <see cref="DeclareTaxInvestmentCommand"/>.
/// </summary>
public class DeclareTaxInvestmentCommandValidator : AbstractValidator<DeclareTaxInvestmentCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public DeclareTaxInvestmentCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid EmployeeId is required.");
        RuleFor(x => x.FinancialYear).NotEmpty().WithMessage("Financial year is required (e.g. 2026-2027).");
        RuleFor(x => x.Section80CAmount).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Section80DAmount).GreaterThanOrEqualTo(0);
    }
}

/// <summary>
/// Handler for <see cref="DeclareTaxInvestmentCommand"/>.
/// </summary>
public class DeclareTaxInvestmentCommandHandler : IRequestHandler<DeclareTaxInvestmentCommand, ApiResponse<TaxDeclarationDto>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public DeclareTaxInvestmentCommandHandler(IEmployeeRepository employeeRepository, IUnitOfWork unitOfWork)
    {
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TaxDeclarationDto>> Handle(DeclareTaxInvestmentCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<TaxDeclarationDto>.Fail("Employee not found.");
        }

        var dto = new TaxDeclarationDto(
            request.EmployeeId,
            request.FinancialYear,
            request.Section80CAmount,
            request.Section80DAmount,
            request.HraRentPaidAnnual,
            request.HomeLoanInterest,
            request.OtherExemptions,
            DateTimeOffset.UtcNow);

        await _unitOfWork.SaveChangesAsync(ct);
        return ApiResponse<TaxDeclarationDto>.Success(dto, "Tax declaration submitted successfully.");
    }
}
