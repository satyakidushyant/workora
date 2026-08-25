using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.RegisterOrganization;

/// <summary>
/// Command to register a new tenant organization / company.
/// </summary>
public record RegisterOrganizationCommand(
    string Name,
    string Code,
    string? RegistrationNumber = null,
    string? TaxId = null,
    string? Email = null,
    string? Phone = null,
    string? Website = null,
    int FiscalYearStartMonth = 1,
    string Currency = "USD",
    string? Address = null) : IRequest<ApiResponse<OrganizationDto>>;

/// <summary>
/// Validator for <see cref="RegisterOrganizationCommand"/>.
/// </summary>
public class RegisterOrganizationCommandValidator : AbstractValidator<RegisterOrganizationCommand>
{
    /// <summary>
    /// Initializes validation rules for RegisterOrganizationCommand.
    /// </summary>
    public RegisterOrganizationCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Organization name is required.")
            .MaximumLength(150).WithMessage("Organization name must not exceed 150 characters.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Organization code is required.")
            .MaximumLength(20).WithMessage("Organization code must not exceed 20 characters.");

        RuleFor(x => x.FiscalYearStartMonth)
            .InclusiveBetween(1, 12).WithMessage("Fiscal year start month must be between 1 and 12.");
    }
}

/// <summary>
/// Handler for <see cref="RegisterOrganizationCommand"/>.
/// </summary>
public class RegisterOrganizationCommandHandler : IRequestHandler<RegisterOrganizationCommand, ApiResponse<OrganizationDto>>
{
    private readonly IGenericRepository<Company> _companyRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="RegisterOrganizationCommandHandler"/> class.
    /// </summary>
    public RegisterOrganizationCommandHandler(
        IGenericRepository<Company> companyRepository,
        IUnitOfWork unitOfWork)
    {
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes registration of a new organization.
    /// </summary>
    public async Task<ApiResponse<OrganizationDto>> Handle(RegisterOrganizationCommand request, CancellationToken cancellationToken)
    {
        var existing = await _companyRepository.GetFirstOrDefaultAsync(
            c => c.Code == request.Code.ToUpperInvariant(), cancellationToken);

        if (existing != null)
        {
            return ApiResponse<OrganizationDto>.Fail($"Organization with code '{request.Code}' already exists.");
        }

        var company = Company.Create(
            request.Name,
            request.Code,
            request.RegistrationNumber,
            request.TaxId,
            request.Email,
            request.Phone,
            request.Website,
            request.FiscalYearStartMonth,
            request.Currency,
            request.Address);

        await _companyRepository.AddAsync(company, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = new OrganizationDto
        {
            Id = company.Id,
            Name = company.Name,
            Code = company.Code,
            RegistrationNumber = company.RegistrationNumber,
            TaxId = company.TaxId,
            Email = company.Email,
            Phone = company.Phone,
            Website = company.Website,
            LogoUrl = company.LogoUrl,
            Currency = company.Currency,
            IsActive = company.IsActive,
            CreatedAt = company.CreatedAt
        };

        return ApiResponse<OrganizationDto>.Success(dto, "Tenant organization registered successfully.");
    }
}
