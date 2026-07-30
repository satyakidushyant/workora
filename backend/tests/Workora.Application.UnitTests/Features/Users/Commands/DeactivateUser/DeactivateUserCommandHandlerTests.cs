using Moq;
using Workora.Application.Features.Users.Commands.DeactivateUser;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;
using Xunit;

namespace Workora.Application.UnitTests.Features.Users.Commands.DeactivateUser;

/// <summary>
/// Unit tests for <see cref="DeactivateUserCommandHandler"/>.
/// </summary>
public class DeactivateUserCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly DeactivateUserCommandHandler _handler;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeactivateUserCommandHandlerTests"/> class.
    /// </summary>
    public DeactivateUserCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _handler = new DeactivateUserCommandHandler(_userRepositoryMock.Object);
    }

    /// <summary>
    /// Tests that Handle deactivates the user when another active admin exists.
    /// </summary>
    [Fact]
    public async Task Handle_GivenValidUserAndOtherAdminExists_ReturnsSuccess()
    {
        // Arrange
        var user = User.Create(EmailAddress.Create("user@example.com"), "Jane", "Doe", "Hash123");
        user.Id = 1;
        _userRepositoryMock.Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>())).ReturnsAsync(user);
        _userRepositoryMock.Setup(r => r.HasOtherSuperAdminAsync(It.IsAny<int>(), It.IsAny<CancellationToken>())).ReturnsAsync(true);

        // Act
        var result = await _handler.Handle(new DeactivateUserCommand(1), CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.False(user.IsActive);
        _userRepositoryMock.Verify(r => r.Update(user), Times.Once);
    }

    /// <summary>
    /// Tests that Handle prevents deactivation of the sole admin.
    /// </summary>
    [Fact]
    public async Task Handle_GivenSoleAdmin_ReturnsFailure()
    {
        // Arrange
        var user = User.Create(EmailAddress.Create("admin@example.com"), "Admin", "User", "Hash123");
        user.Id = 1;
        _userRepositoryMock.Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>())).ReturnsAsync(user);
        _userRepositoryMock.Setup(r => r.HasOtherSuperAdminAsync(It.IsAny<int>(), It.IsAny<CancellationToken>())).ReturnsAsync(false);

        // Act
        var result = await _handler.Handle(new DeactivateUserCommand(1), CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("sole active user", result.Message);
    }
}
