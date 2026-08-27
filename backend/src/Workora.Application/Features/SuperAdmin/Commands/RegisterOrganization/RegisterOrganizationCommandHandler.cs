using FluentValidation;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.RegisterOrganization;

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
            return ApiResponse<OrganizationDto>.Fail(ResponseMessage.OrganizationCodeAlreadyExists.GetDescription());
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

        return ApiResponse<OrganizationDto>.Success(dto, ResponseMessage.OrganizationRegistered.GetDescription());
    }
}
