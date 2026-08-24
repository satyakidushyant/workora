using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.Commands.UploadCompanyLogo;

/// <summary>
/// Command to update the company logo URL.
/// </summary>
public record UploadCompanyLogoCommand(int? CompanyId, string LogoUrl) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Validator for <see cref="UploadCompanyLogoCommand"/>.
/// </summary>
public class UploadCompanyLogoCommandValidator : AbstractValidator<UploadCompanyLogoCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="UploadCompanyLogoCommand"/>.
    /// </summary>
    public UploadCompanyLogoCommandValidator()
    {
        RuleFor(x => x.LogoUrl)
            .NotEmpty().WithMessage("Logo URL is required.")
            .MaximumLength(500).WithMessage("Logo URL must not exceed 500 characters.");
    }
}

/// <summary>
/// Handler for <see cref="UploadCompanyLogoCommand"/>.
/// </summary>
public class UploadCompanyLogoCommandHandler : IRequestHandler<UploadCompanyLogoCommand, ApiResponse<bool>>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="UploadCompanyLogoCommandHandler"/> class.
    /// </summary>
    public UploadCompanyLogoCommandHandler(ICompanyRepository companyRepository, IUnitOfWork unitOfWork)
    {
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(UploadCompanyLogoCommand request, CancellationToken ct)
    {
        var company = request.CompanyId.HasValue
            ? await _companyRepository.GetByIdAsync(request.CompanyId.Value, ct)
            : await _companyRepository.GetDefaultCompanyAsync(ct);

        if (company == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        company.UpdateLogo(request.LogoUrl);
        _companyRepository.Update(company);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.CompanyUpdated.GetDescription());
    }
}
