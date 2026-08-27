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
