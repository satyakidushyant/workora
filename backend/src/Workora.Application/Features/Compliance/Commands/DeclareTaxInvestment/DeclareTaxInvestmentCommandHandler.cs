using FluentValidation;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.Commands.DeclareTaxInvestment;

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
            return ApiResponse<TaxDeclarationDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
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
        return ApiResponse<TaxDeclarationDto>.Success(dto, ResponseMessage.TaxDeclarationSubmitted.GetDescription());
    }
}
