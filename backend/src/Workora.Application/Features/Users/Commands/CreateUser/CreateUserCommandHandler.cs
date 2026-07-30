using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Users.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Events.Users;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Commands.CreateUser;

/// <summary>
/// Handler for <see cref="CreateUserCommand"/>.
/// </summary>
public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, ApiResponse<UserDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateUserCommandHandler"/> class.
    /// </summary>
    /// <param name="userRepository">The user repository.</param>
    /// <param name="passwordHasher">The password hasher service.</param>
    /// <param name="mapper">The mapper instance.</param>
    public CreateUserCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<UserDto>> Handle(CreateUserCommand request, CancellationToken ct)
    {
        EmailAddress emailObj;
        try
        {
            emailObj = EmailAddress.Create(request.Email);
        }
        catch (ArgumentException ex)
        {
            return ApiResponse<UserDto>.Fail(ex.Message);
        }

        var isUnique = await _userRepository.IsEmailUniqueAsync(emailObj, ct);
        if (!isUnique)
        {
            return ApiResponse<UserDto>.Fail("A user with this email address already exists.");
        }

        var hashedPassword = _passwordHasher.HashPassword(request.Password);
        var user = User.Create(emailObj, request.FirstName, request.LastName, hashedPassword, request.EmployeeId);

        await _userRepository.AddAsync(user, ct);

        var dto = _mapper.Map<UserDto>(user);
        return ApiResponse<UserDto>.Success(dto);
    }
}
