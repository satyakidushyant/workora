using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.ReactivateOrganization;

/// <summary>
/// Command to reactivate a suspended tenant organization.
/// </summary>
public record ReactivateOrganizationCommand(int Id) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Validator for <see cref="ReactivateOrganizationCommand"/>.
/// </summary>
public class ReactivateOrganizationCommandValidator : AbstractValidator<ReactivateOrganizationCommand>
{
    /// <summary>
    /// Initializes validation rules for ReactivateOrganizationCommand.
    /// </summary>
    public ReactivateOrganizationCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid organization ID is required.");
    }
}

/// <summary>
/// Handler for <see cref="ReactivateOrganizationCommand"/>.
/// </summary>
public class ReactivateOrganizationCommandHandler : IRequestHandler<ReactivateOrganizationCommand, ApiResponse<bool>>
{
    private readonly IGenericRepository<Company> _companyRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="ReactivateOrganizationCommandHandler"/> class.
    /// </summary>
    public ReactivateOrganizationCommandHandler(
        IGenericRepository<Company> companyRepository,
        IUnitOfWork unitOfWork)
    {
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes reactivation of an organization.
    /// </summary>
    public async Task<ApiResponse<bool>> Handle(ReactivateOrganizationCommand request, CancellationToken cancellationToken)
    {
        var company = await _companyRepository.GetByIdAsync(request.Id, cancellationToken);
        if (company == null)
        {
            return ApiResponse<bool>.Fail("Organization not found.");
        }

        company.IsActive = true;
        _companyRepository.Update(company);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ApiResponse<bool>.Success(true, "Organization reactivated successfully.");
    }
}
