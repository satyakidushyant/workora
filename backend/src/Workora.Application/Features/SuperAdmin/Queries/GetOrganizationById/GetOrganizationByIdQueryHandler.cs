using MediatR;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Queries.GetOrganizationById;

/// <summary>
/// Handler for <see cref="GetOrganizationByIdQuery"/> that retrieves detailed tenant organization information
/// including branch and workforce headcount metrics.
/// </summary>
public class GetOrganizationByIdQueryHandler : IRequestHandler<GetOrganizationByIdQuery, ApiResponse<OrganizationDto>>
{
    private readonly IGenericRepository<Company> _companyRepository;
    private readonly IGenericRepository<Branch> _branchRepository;
    private readonly IGenericRepository<Employee> _employeeRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetOrganizationByIdQueryHandler"/> class.
    /// </summary>
    /// <param name="companyRepository">The company repository.</param>
    /// <param name="branchRepository">The branch repository.</param>
    /// <param name="employeeRepository">The employee repository.</param>
    public GetOrganizationByIdQueryHandler(
        IGenericRepository<Company> companyRepository,
        IGenericRepository<Branch> branchRepository,
        IGenericRepository<Employee> employeeRepository)
    {
        _companyRepository = companyRepository;
        _branchRepository = branchRepository;
        _employeeRepository = employeeRepository;
    }

    /// <summary>
    /// Executes retrieval of organization details.
    /// </summary>
    /// <param name="request">The organization detail query request.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The detailed organization DTO.</returns>
    public async Task<ApiResponse<OrganizationDto>> Handle(GetOrganizationByIdQuery request, CancellationToken cancellationToken)
    {
        var company = await _companyRepository.GetByIdAsync(request.Id, cancellationToken);
        if (company == null)
        {
            return ApiResponse<OrganizationDto>.Fail(ResponseMessage.OrganizationNotFound.GetDescription());
        }

        var branchCount = _branchRepository.GetQueryable()
            .Count(b => b.CompanyId == company.Id);

        var employeeCount = _employeeRepository.GetQueryable()
            .Count(e => e.Branch.CompanyId == company.Id || (e.Department != null && e.Department.CompanyId == company.Id));

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
            BranchCount = branchCount,
            EmployeeCount = employeeCount,
            SubscriptionPlan = "Growth",
            Industry = "Information Technology",
            PrimaryContactName = company.Name + " Admin",
            IsActive = company.IsActive,
            CreatedAt = company.CreatedAt
        };

        return ApiResponse<OrganizationDto>.Success(dto, ResponseMessage.OrganizationRetrieved.GetDescription());
    }
}
