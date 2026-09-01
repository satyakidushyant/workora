using FluentValidation;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.UpdateOrganization;

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
            return ApiResponse<OrganizationDto>.Fail(ResponseMessage.OrganizationNotFound.GetDescription());
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
            Address = company.Address,
            FiscalYearStartMonth = company.FiscalYearStartMonth,
            Currency = company.Currency,
            SubscriptionPlan = "Growth",
            Industry = "Information Technology",
            PrimaryContactName = company.Name + " Admin",
            IsActive = company.IsActive,
            CreatedAt = company.CreatedAt
        };

        return ApiResponse<OrganizationDto>.Success(dto, ResponseMessage.OrganizationUpdated.GetDescription());

    }
}
