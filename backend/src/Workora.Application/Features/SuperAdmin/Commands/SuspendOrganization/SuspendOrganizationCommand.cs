using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.SuspendOrganization;

/// <summary>
/// Command to suspend a tenant organization.
/// </summary>
public record SuspendOrganizationCommand(int Id) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Validator for <see cref="SuspendOrganizationCommand"/>.
/// </summary>
public class SuspendOrganizationCommandValidator : AbstractValidator<SuspendOrganizationCommand>
{
    /// <summary>
    /// Initializes validation rules for SuspendOrganizationCommand.
    /// </summary>
    public SuspendOrganizationCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid organization ID is required.");
    }
}

/// <summary>
/// Handler for <see cref="SuspendOrganizationCommand"/>.
/// </summary>
public class SuspendOrganizationCommandHandler : IRequestHandler<SuspendOrganizationCommand, ApiResponse<bool>>
{
    private readonly IGenericRepository<Company> _companyRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="SuspendOrganizationCommandHandler"/> class.
    /// </summary>
    public SuspendOrganizationCommandHandler(
        IGenericRepository<Company> companyRepository,
        IUnitOfWork unitOfWork)
    {
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes suspension of an organization.
    /// </summary>
    public async Task<ApiResponse<bool>> Handle(SuspendOrganizationCommand request, CancellationToken cancellationToken)
    {
        var company = await _companyRepository.GetByIdAsync(request.Id, cancellationToken);
        if (company == null)
        {
            return ApiResponse<bool>.Fail("Organization not found.");
        }

        company.IsActive = false;
        _companyRepository.Update(company);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ApiResponse<bool>.Success(true, "Organization suspended successfully.");
    }
}
