using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Users.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Queries.GetUsersList;

/// <summary>
/// Handler for <see cref="GetUsersListQuery"/>.
/// </summary>
public class GetUsersListQueryHandler : IRequestHandler<GetUsersListQuery, ApiResponse<PagedResponse<UserDto>>>
{
    private readonly IUserRepository _userRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetUsersListQueryHandler"/> class.
    /// </summary>
    public GetUsersListQueryHandler(
        IUserRepository userRepository,
        IEmployeeRepository employeeRepository,
        ICompanyRepository companyRepository,
        ITenantResolutionService tenantResolutionService,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _employeeRepository = employeeRepository;
        _companyRepository = companyRepository;
        _tenantResolutionService = tenantResolutionService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<UserDto>>> Handle(GetUsersListQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);

        var users = await _userRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            request.IsActive,
            targetCompanyId,
            ct);

        var totalCount = await _userRepository.GetCountAsync(
            request.SearchTerm,
            request.IsActive,
            targetCompanyId,
            ct);

        var dtos = _mapper.Map<List<UserDto>>(users);

        // Enrich DTOs with Tenant Company and Employee profile information
        var allCompanies = await _companyRepository.GetAllCompaniesAsync(ct);
        var companyMap = allCompanies.ToDictionary(c => c.Id);

        foreach (var dto in dtos)
        {
            var user = users.FirstOrDefault(u => u.Id == dto.Id);
            if (user == null) continue;

            if (dto.Roles.Contains("SuperAdmin"))
            {
                dto.CompanyName = "Platform Administration";
                dto.CompanyCode = "SUPERADMIN";
                continue;
            }

            Employee? emp = null;
            if (user.EmployeeId.HasValue)
            {
                emp = await _employeeRepository.GetWithFullDetailsAsync(user.EmployeeId.Value, ct);
            }

            if (emp == null)
            {
                emp = await _employeeRepository.GetByUserIdAsync(user.Id, ct);
            }

            if (emp != null)
            {
                dto.EmployeeId = emp.Id;
                dto.EmployeeCode = emp.EmployeeCode;
                dto.DepartmentName = emp.Department?.Name;
                var cid = emp.Department?.CompanyId ?? emp.Branch?.CompanyId;
                if (cid.HasValue && companyMap.TryGetValue(cid.Value, out var comp))
                {
                    dto.CompanyId = comp.Id;
                    dto.CompanyName = comp.Name;
                    dto.CompanyCode = comp.Code;
                }
            }
            else
            {
                var compByEmail = await _companyRepository.GetByEmailOrDomainAsync(user.Email.Value, ct);
                if (compByEmail != null)
                {
                    dto.CompanyId = compByEmail.Id;
                    dto.CompanyName = compByEmail.Name;
                    dto.CompanyCode = compByEmail.Code;
                }
            }
        }

        var pagedResponse = new PagedResponse<UserDto>
        {
            Items = dtos,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };

        return ApiResponse<PagedResponse<UserDto>>.Success(pagedResponse);
    }
}

