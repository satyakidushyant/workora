using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.UpdateOrganization;

/// <summary>
/// Command to update an existing organization profile from SuperAdmin.
/// </summary>
public record UpdateOrganizationCommand(
    int Id,
    string Name,
    string? RegistrationNumber = null,
    string? TaxId = null,
    string? Email = null,
    string? Phone = null,
    string? Website = null,
    int FiscalYearStartMonth = 1,
    string Currency = "USD",
    string? Address = null) : IRequest<ApiResponse<OrganizationDto>>;

/// <summary>
/// Validator for <see cref="UpdateOrganizationCommand"/>.
/// </summary>
public class UpdateOrganizationCommandValidator : AbstractValidator<UpdateOrganizationCommand>
{
    /// <summary>
    /// Initializes validation rules for UpdateOrganizationCommand.
    /// </summary>
    public UpdateOrganizationCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid organization ID is required.");
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Organization name is required.")
            .MaximumLength(150).WithMessage("Organization name must not exceed 150 characters.");

        RuleFor(x => x.FiscalYearStartMonth)
            .InclusiveBetween(1, 12).WithMessage("Fiscal year start month must be between 1 and 12.");
    }
}

/// <summary>
/// Handler for <see cref="UpdateOrganizationCommand"/>.
/// </summary>
public class UpdateOrganizationCommandHandler : IRequestHandler<UpdateOrganizationCommand, ApiResponse<OrganizationDto>>
{
    private readonly IGenericRepository<Company> _companyRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateOrganizationCommandHandler"/> class.
    /// </summary>
    public UpdateOrganizationCommandHandler(
        IGenericRepository<Company> companyRepository,
        IUnitOfWork unitOfWork)
    {
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes updating of an organization.
    /// </summary>
    public async Task<ApiResponse<OrganizationDto>> Handle(UpdateOrganizationCommand request, CancellationToken cancellationToken)
    {
        var company = await _companyRepository.GetByIdAsync(request.Id, cancellationToken);
        if (company == null)
        {
            return ApiResponse<OrganizationDto>.Fail("Organization not found.");
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

        return ApiResponse<OrganizationDto>.Success(dto, "Organization updated successfully.");
    }
}
