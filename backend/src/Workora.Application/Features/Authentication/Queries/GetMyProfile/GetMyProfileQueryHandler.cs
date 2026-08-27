using MediatR;
using Workora.Application.Common.Exceptions;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Queries.GetMyProfile;

/// <summary>
/// Handler for <see cref="GetMyProfileQuery"/>.
/// Retrieves authenticated user profile, active security roles, granular permission catalog, and organizational context.
/// </summary>
public class GetMyProfileQueryHandler : IRequestHandler<GetMyProfileQuery, ApiResponse<UserProfileDto>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserRepository _userRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IPermissionRepository _permissionRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetMyProfileQueryHandler"/> class.
    /// </summary>
    /// <param name="currentUserService">The current user context service.</param>
    /// <param name="userRepository">The user repository.</param>
    /// <param name="employeeRepository">The employee repository.</param>
    /// <param name="permissionRepository">The permission repository.</param>
    public GetMyProfileQueryHandler(
        ICurrentUserService currentUserService,
        IUserRepository userRepository,
        IEmployeeRepository employeeRepository,
        IPermissionRepository permissionRepository)
    {
        _currentUserService = currentUserService;
        _userRepository = userRepository;
        _employeeRepository = employeeRepository;
        _permissionRepository = permissionRepository;
    }

    /// <summary>
    /// Handles the query request to retrieve profile details for the currently authenticated user.
    /// </summary>
    /// <param name="request">The query request.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>An API response with the user profile DTO.</returns>
    /// <exception cref="UnauthorizedException">Thrown when user context is null.</exception>
    /// <exception cref="NotFoundException">Thrown when current user does not exist in repository.</exception>
    public async Task<ApiResponse<UserProfileDto>> Handle(GetMyProfileQuery request, CancellationToken cancellationToken)
    {
        var userUuid = _currentUserService.UserId;
        if (userUuid == null)
        {
            throw new UnauthorizedException("User is not authenticated.");
        }

        var user = await _userRepository.GetByUuidAsync(userUuid.Value, cancellationToken);
        if (user == null)
        {
            throw new NotFoundException(nameof(User), userUuid.Value);
        }

        var roles = user.UserRoles
            .Where(ur => ur.Role != null)
            .Select(ur => ur.Role.Name)
            .Distinct()
            .ToList();

        if (!roles.Any())
        {
            roles.Add("Employee");
        }

        List<string> permissions;
        if (roles.Contains("SuperAdmin"))
        {
            var allPermissions = await _permissionRepository.GetAllAsync(cancellationToken);
            permissions = allPermissions.Select(p => p.Code).Distinct().ToList();
        }
        else
        {
            permissions = user.UserRoles
                .Where(ur => ur.Role != null)
                .SelectMany(ur => ur.Role.RolePermissions)
                .Where(rp => rp.Permission != null)
                .Select(rp => rp.Permission.Code)
                .Distinct()
                .ToList();
        }

        int? companyId = null;
        string? companyName = null;
        string? companyCode = null;
        string? employeeCode = null;
        string? departmentName = null;
        string? designationTitle = null;

        if (user.EmployeeId.HasValue)
        {
            var employee = await _employeeRepository.GetWithFullDetailsAsync(user.EmployeeId.Value, cancellationToken);
            if (employee != null)
            {
                employeeCode = employee.EmployeeCode;
                departmentName = employee.Department?.Name;
                designationTitle = employee.Designation?.Title;
                if (employee.Branch != null)
                {
                    companyId = employee.Branch.CompanyId;
                    companyName = employee.Branch.Company?.Name;
                    companyCode = employee.Branch.Company?.Code;
                }
            }
        }

        var profileDto = new UserProfileDto(
            user.Uuid,
            user.Email.Value,
            user.FirstName,
            user.LastName,
            user.EmployeeId,
            roles,
            permissions,
            user.Id,
            null,
            companyId,
            companyName,
            companyCode,
            employeeCode,
            departmentName,
            designationTitle
        );

        return ApiResponse<UserProfileDto>.Success(profileDto);
    }
}
