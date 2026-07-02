using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Authentication.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Application.Common.Exceptions;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;

namespace Workora.Application.Features.Authentication.Commands.Login;

/// <summary>
/// Handler for the <see cref="LoginCommand"/>. Authenticates the user and generates tokens.
/// </summary>
public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResultDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="LoginCommandHandler"/> class.
    /// </summary>
    public LoginCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
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
    public async Task<AuthResultDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        
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

        // Role retrieval omitted for simplicity, can be expanded later
        var roles = Array.Empty<string>();
        var permissions = Array.Empty<string>();

        var accessToken = _tokenService.GenerateAccessToken(user, roles, permissions);
        var refreshTokenStr = _tokenService.GenerateRefreshToken();
        var hashedRefreshToken = _tokenService.HashToken(refreshTokenStr);

        var refreshTokenEntity = Workora.Domain.Entities.RefreshToken.Create(
            user.Id, 
            hashedRefreshToken, 
            DateTimeOffset.UtcNow.AddDays(7), 
            "127.0.0.1", // Ideally via ICurrentUserService
            "Unknown"
        );

        await _refreshTokenRepository.AddAsync(refreshTokenEntity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AuthResultDto(accessToken, refreshTokenStr, 15 * 60);
    }
}
