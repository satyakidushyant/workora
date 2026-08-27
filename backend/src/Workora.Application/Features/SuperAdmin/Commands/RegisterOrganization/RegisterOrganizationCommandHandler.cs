using FluentValidation;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.RegisterOrganization;

/// <summary>
/// Handler for <see cref="RegisterOrganizationCommand"/>.
/// Automatically provisions tenant structure (Headquarters Branch, Executive Department, and Tenant Admin account).
/// </summary>
public class RegisterOrganizationCommandHandler : IRequestHandler<RegisterOrganizationCommand, ApiResponse<OrganizationDto>>
{
    private readonly IGenericRepository<Company> _companyRepository;
    private readonly IGenericRepository<Branch> _branchRepository;
    private readonly IGenericRepository<Department> _departmentRepository;
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="RegisterOrganizationCommandHandler"/> class.
    /// </summary>
    public RegisterOrganizationCommandHandler(
        IGenericRepository<Company> companyRepository,
        IGenericRepository<Branch> branchRepository,
        IGenericRepository<Department> departmentRepository,
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork)
    {
        _companyRepository = companyRepository;
        _branchRepository = branchRepository;
        _departmentRepository = departmentRepository;
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _passwordHasher = passwordHasher;
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

        // Auto-provision default Headquarters Branch & Executive Management Department
        var locationStr = !string.IsNullOrWhiteSpace(request.Address) ? request.Address : "Main Office";
        var defaultBranch = Branch.Create(
            company.Id, 
            "Headquarters", 
            "HQ", 
            locationStr, 
            request.Address, 
            isHeadOffice: true);

        var defaultDept = Department.Create(
            company.Id, 
            "EXEC", 
            "Executive Management");

        await _branchRepository.AddAsync(defaultBranch, cancellationToken);
        await _departmentRepository.AddAsync(defaultDept, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Auto-provision or link the Organization Administrator user account
        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var adminEmail = EmailAddress.Create(request.Email.Trim().ToLowerInvariant());
            var existingUser = await _userRepository.GetByEmailAsync(adminEmail, cancellationToken);
            var hrAdminRole = await _roleRepository.GetByNameAsync("HRAdmin", cancellationToken);

            if (existingUser == null)
            {
                var defaultPasswordHash = _passwordHasher.HashPassword("Admin@123");
                var adminUser = User.Create(
                    adminEmail,
                    request.Name + " Admin",
                    "Officer",
                    defaultPasswordHash);

                await _userRepository.AddAsync(adminUser, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                if (hrAdminRole != null)
                {
                    await _userRepository.AssignUserRolesAsync(adminUser.Id, new[] { hrAdminRole.Id }, cancellationToken);
                }
            }
            else if (hrAdminRole != null && !existingUser.UserRoles.Any(r => r.RoleId == hrAdminRole.Id))
            {
                var existingRoleIds = existingUser.UserRoles.Select(r => r.RoleId).ToList();
                existingRoleIds.Add(hrAdminRole.Id);
                await _userRepository.AssignUserRolesAsync(existingUser.Id, existingRoleIds, cancellationToken);
            }
        }

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
