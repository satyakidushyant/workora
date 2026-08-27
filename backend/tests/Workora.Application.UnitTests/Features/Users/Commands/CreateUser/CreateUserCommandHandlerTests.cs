using AutoMapper;
using Moq;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Users.Commands.CreateUser;
using Workora.Application.Features.Users.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;
using Xunit;

namespace Workora.Application.UnitTests.Features.Users.Commands.CreateUser;

/// <summary>
/// Unit tests for <see cref="CreateUserCommandHandler"/>.
/// </summary>
public class CreateUserCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IRoleRepository> _roleRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IPasswordHasher> _passwordHasherMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly CreateUserCommandHandler _handler;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateUserCommandHandlerTests"/> class.
    /// </summary>
    public CreateUserCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _roleRepositoryMock = new Mock<IRoleRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _passwordHasherMock = new Mock<IPasswordHasher>();
        _mapperMock = new Mock<IMapper>();

        _handler = new CreateUserCommandHandler(
            _userRepositoryMock.Object,
            _roleRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _passwordHasherMock.Object,
            _mapperMock.Object);
    }

    /// <summary>
    /// Tests that Handle returns success when given valid and unique user details.
    /// </summary>
    [Fact]
    public async Task Handle_GivenValidDetails_ReturnsSuccessResponse()
    {
        // Arrange
        var command = new CreateUserCommand("john.doe@example.com", "John", "Doe", "Secret123!");

        _userRepositoryMock
            .Setup(r => r.IsEmailUniqueAsync(It.IsAny<EmailAddress>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        _passwordHasherMock
            .Setup(h => h.HashPassword(It.IsAny<string>()))
            .Returns("HashedPassword123");

        _mapperMock
            .Setup(m => m.Map<UserDto>(It.IsAny<User>()))
            .Returns(new UserDto { Id = 1, Email = "john.doe@example.com", FirstName = "John", LastName = "Doe" });

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal("john.doe@example.com", result.Data.Email);
        _userRepositoryMock.Verify(r => r.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    /// <summary>
    /// Tests that Handle returns failure when email is already in use.
    /// </summary>
    [Fact]
    public async Task Handle_GivenDuplicateEmail_ReturnsFailureResponse()
    {
        // Arrange
        var command = new CreateUserCommand("existing@example.com", "John", "Doe", "Secret123!");

        _userRepositoryMock
            .Setup(r => r.IsEmailUniqueAsync(It.IsAny<EmailAddress>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("already exists", result.Message);
        _userRepositoryMock.Verify(r => r.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
