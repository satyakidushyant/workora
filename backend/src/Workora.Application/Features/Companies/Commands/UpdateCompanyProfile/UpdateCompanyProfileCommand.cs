using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Companies.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.Commands.UpdateCompanyProfile;

/// <summary>
/// Command to update the primary company profile.
/// </summary>
public record UpdateCompanyProfileCommand(
    int? CompanyId,
    string Name,
    string? RegistrationNumber,
    string? TaxId,
    string? Email,
    string? Phone,
    string? Website,
    int FiscalYearStartMonth,
    string Currency,
    string? Address) : IRequest<ApiResponse<CompanyDto>>;

/// <summary>
/// Validator for <see cref="UpdateCompanyProfileCommand"/>.
/// </summary>
public class UpdateCompanyProfileCommandValidator : AbstractValidator<UpdateCompanyProfileCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="UpdateCompanyProfileCommand"/>.
    /// </summary>
    public UpdateCompanyProfileCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Company name is required.")
            .MaximumLength(200).WithMessage("Company name must not exceed 200 characters.");

        RuleFor(x => x.FiscalYearStartMonth)
            .InclusiveBetween(1, 12).WithMessage("Fiscal year start month must be between 1 and 12.");

        RuleFor(x => x.Currency)
            .NotEmpty().WithMessage("Currency is required.")
            .MaximumLength(10).WithMessage("Currency code must not exceed 10 characters.");

        RuleFor(x => x.Email)
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email))
            .WithMessage("Invalid email format.");
    }
}

/// <summary>
/// Handler for <see cref="UpdateCompanyProfileCommand"/>.
/// </summary>
public class UpdateCompanyProfileCommandHandler : IRequestHandler<UpdateCompanyProfileCommand, ApiResponse<CompanyDto>>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateCompanyProfileCommandHandler"/> class.
    /// </summary>
    public UpdateCompanyProfileCommandHandler(
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<CompanyDto>> Handle(UpdateCompanyProfileCommand request, CancellationToken ct)
    {
        var company = request.CompanyId.HasValue
            ? await _companyRepository.GetByIdAsync(request.CompanyId.Value, ct)
            : await _companyRepository.GetDefaultCompanyAsync(ct);

        if (company == null)
        {
            return ApiResponse<CompanyDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        company.UpdateProfile(
            request.Name,
            request.RegistrationNumber,
            request.TaxId,
            request.Email,
            request.Phone,
            request.Website,
            request.FiscalYearStartMonth,
            request.Currency,
            request.Address);

        _companyRepository.Update(company);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<CompanyDto>(company);
        return ApiResponse<CompanyDto>.Success(dto, ResponseMessage.CompanyUpdated.GetDescription());
    }
}
