using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Application.Common.Exceptions;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.ValueObjects;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Authentication.Commands.Login;

/// <summary>
/// Handler for the <see cref="LoginCommand"/>. Authenticates user credentials and generates JWT access and refresh tokens.
/// </summary>
public class LoginCommandHandler : IRequestHandler<LoginCommand, ApiResponse<AuthResultDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IPermissionRepository _permissionRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="LoginCommandHandler"/> class.
    /// </summary>
    public LoginCommandHandler(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        IPermissionRepository permissionRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _permissionRepository = permissionRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Handles the login request by validating credentials and generating a JWT.
    /// </summary>
    /// <param name="request">The login command containing email and password.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>An AuthResultDto containing the tokens.</returns>
    public async Task<ApiResponse<AuthResultDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        EmailAddress emailAddress;
        try
        {
            emailAddress = EmailAddress.Create(request.Email?.Trim() ?? string.Empty);
        }
        catch (ArgumentException)
        {
            throw new UnauthorizedException(ResponseMessage.InvalidCredentials.GetDescription());
        }

        var user = await _userRepository.GetByEmailAsync(emailAddress, cancellationToken);
        
        if (user == null)
        {
            throw new UnauthorizedException(ResponseMessage.InvalidCredentials.GetDescription());
        }

        if (user.IsLockedOut)
        {
            throw new UnauthorizedException(ResponseMessage.AccountLocked.GetDescription());
        }

        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            user.RecordFailedLogin();
            _userRepository.Update(user);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            throw new UnauthorizedException(ResponseMessage.InvalidCredentials.GetDescription());
        }

        user.ResetFailedLogin();
        _userRepository.Update(user);

        // Dynamically resolve roles from database
        var roles = user.UserRoles
            .Where(ur => ur.Role != null)
            .Select(ur => ur.Role.Name)
            .Distinct()
            .ToList();

        if (!roles.Any())
        {
            var defaultRoleName = (user.Email.Value.StartsWith("admin", StringComparison.OrdinalIgnoreCase) ||
                                   user.Email.Value.StartsWith("hr", StringComparison.OrdinalIgnoreCase))
                                   ? "HRAdmin" : "Employee";

            var defaultRole = await _roleRepository.GetByNameAsync(defaultRoleName, cancellationToken)
                              ?? await _roleRepository.GetByNameAsync("Employee", cancellationToken);

            if (defaultRole != null)
            {
                await _userRepository.AssignUserRolesAsync(user.Id, new[] { defaultRole.Id }, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                roles.Add(defaultRole.Name);
            }
            else
            {
                roles.Add("Employee");
            }
        }

        // Dynamically resolve permissions from database
        List<string> permissions;
        if (roles.Contains("SuperAdmin"))
        {
            var allPermissions = await _permissionRepository.GetAllAsync(cancellationToken);
            permissions = allPermissions.Select(p => p.Code).Distinct().ToList();
        }
        else
        {
            var permissionsSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var roleName in roles)
            {
                var roleObj = await _roleRepository.GetByNameAsync(roleName, cancellationToken);
                if (roleObj?.RolePermissions != null)
                {
                    foreach (var rp in roleObj.RolePermissions)
                    {
                        if (rp.Permission != null && !string.IsNullOrWhiteSpace(rp.Permission.Code))
                        {
                            permissionsSet.Add(rp.Permission.Code);
                        }
                    }
                }
            }

            // Always guarantee essential self-service authentication and ESS baseline permissions
            var basePermissions = new[]
            {
                "auth.me", "auth.logout", "auth.change-password", "auth.sessions", "auth.logout-all",
                "attendance.self", "attendance.view", "leave.self", "leave.apply", "payroll.self",
                "holidays.view", "dashboard.view", "employees.self", "employees.view"
            };

            foreach (var bp in basePermissions)
            {
                permissionsSet.Add(bp);
            }

            permissions = permissionsSet.ToList();
        }

        var accessToken = _tokenService.GenerateAccessToken(user, roles, permissions);
        var refreshTokenStr = _tokenService.GenerateRefreshToken();
        var hashedRefreshToken = _tokenService.HashToken(refreshTokenStr);

        var refreshTokenEntity = Workora.Domain.Entities.RefreshToken.Create(
            user.Id, 
            hashedRefreshToken, 
            DateTimeOffset.UtcNow.AddDays(7), 
            "127.0.0.1",
            "Unknown"
        );

        await _refreshTokenRepository.AddAsync(refreshTokenEntity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ApiResponse<AuthResultDto>.Success(new AuthResultDto(accessToken, refreshTokenStr, 15 * 60));
    }
}
