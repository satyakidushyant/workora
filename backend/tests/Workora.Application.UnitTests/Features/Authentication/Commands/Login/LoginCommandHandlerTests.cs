using FluentAssertions;
using Moq;
using Workora.Application.Common.Exceptions;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Authentication.Commands.Login;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;
using Xunit;

namespace Workora.Application.UnitTests.Features.Authentication.Commands.Login;

public class LoginCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IPasswordHasher> _passwordHasherMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly Mock<IRefreshTokenRepository> _refreshTokenRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly LoginCommandHandler _handler;

    public LoginCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _passwordHasherMock = new Mock<IPasswordHasher>();
        _tokenServiceMock = new Mock<ITokenService>();
        _refreshTokenRepositoryMock = new Mock<IRefreshTokenRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();

        _handler = new LoginCommandHandler(
            _userRepositoryMock.Object,
            _passwordHasherMock.Object,
            _tokenServiceMock.Object,
            _refreshTokenRepositoryMock.Object,
            _unitOfWorkMock.Object);
    }

    [Fact]
    public async Task Handle_GivenValidCredentials_ReturnsAuthResult()
    {
        // Arrange
        var command = new LoginCommand("test@example.com", "Password123!");
        var user = User.Create(EmailAddress.Create("test@example.com"), "John", "Doe", "hashed_password");
        
        _userRepositoryMock.Setup(repo => repo.GetByEmailAsync(It.Is<EmailAddress>(e => e.Value == command.Email), It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        _passwordHasherMock.Setup(hasher => hasher.VerifyPassword(command.Password, user.PasswordHash))
            .Returns(true);

        _tokenServiceMock.Setup(ts => ts.GenerateAccessToken(user, It.IsAny<string[]>(), It.IsAny<string[]>()))
            .Returns("access_token");

        _tokenServiceMock.Setup(ts => ts.GenerateRefreshToken())
            .Returns("refresh_token");

        _tokenServiceMock.Setup(ts => ts.HashToken("refresh_token"))
            .Returns("hashed_refresh_token");

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.AccessToken.Should().Be("access_token");
        result.Data!.RefreshToken.Should().Be("refresh_token");

        _userRepositoryMock.Verify(repo => repo.Update(It.Is<User>(u => u.FailedLoginAttempts == 0)), Times.Once);
        _refreshTokenRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_GivenInvalidEmail_ThrowsUnauthorizedException()
    {
        // Arrange
        var command = new LoginCommand("wrong@example.com", "Password123!");
        
        _userRepositoryMock.Setup(repo => repo.GetByEmailAsync(It.Is<EmailAddress>(e => e.Value == command.Email), It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        var exception = await act.Should().ThrowAsync<UnauthorizedException>();
        exception.WithMessage(ResponseMessage.InvalidCredentials.GetDescription());
    }

    [Fact]
    public async Task Handle_GivenInvalidPassword_ThrowsUnauthorizedExceptionAndIncrementsFailedAttempts()
    {
        // Arrange
        var command = new LoginCommand("test@example.com", "WrongPassword!");
        var user = User.Create(EmailAddress.Create("test@example.com"), "John", "Doe", "hashed_password");
        
        _userRepositoryMock.Setup(repo => repo.GetByEmailAsync(It.Is<EmailAddress>(e => e.Value == command.Email), It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        _passwordHasherMock.Setup(hasher => hasher.VerifyPassword(command.Password, user.PasswordHash))
            .Returns(false);

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        var exception = await act.Should().ThrowAsync<UnauthorizedException>();
        exception.WithMessage(ResponseMessage.InvalidCredentials.GetDescription());

        user.FailedLoginAttempts.Should().Be(1);
        _userRepositoryMock.Verify(repo => repo.Update(user), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
