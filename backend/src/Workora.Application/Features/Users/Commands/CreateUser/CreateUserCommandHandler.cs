using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
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
    private readonly IRoleRepository _roleRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateUserCommandHandler"/> class.
    /// </summary>
    public CreateUserCommandHandler(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _unitOfWork = unitOfWork;
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
            return ApiResponse<UserDto>.Fail(ResponseMessage.UserEmailAlreadyExists.GetDescription());
        }

        var hashedPassword = _passwordHasher.HashPassword(request.Password);
        var user = User.Create(emailObj, request.FirstName, request.LastName, hashedPassword, request.EmployeeId);

        await _userRepository.AddAsync(user, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        // Assign default Employee role if role exists
        var defaultRole = await _roleRepository.GetByNameAsync("Employee", ct);
        if (defaultRole != null)
        {
            await _userRepository.AssignUserRolesAsync(user.Id, new[] { defaultRole.Id }, ct);
            await _unitOfWork.SaveChangesAsync(ct);
        }

        var freshUser = await _userRepository.GetByIdAsync(user.Id, ct) ?? user;
        var dto = _mapper.Map<UserDto>(freshUser);
        return ApiResponse<UserDto>.Success(dto);
    }
}
