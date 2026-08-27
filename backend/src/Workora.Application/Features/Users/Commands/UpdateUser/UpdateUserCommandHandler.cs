using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Users.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Commands.UpdateUser;

/// <summary>
/// Handler for <see cref="UpdateUserCommand"/>.
/// </summary>
public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, ApiResponse<UserDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateUserCommandHandler"/> class.
    /// </summary>
    /// <param name="userRepository">The user repository.</param>
    /// <param name="mapper">The mapper instance.</param>
    public UpdateUserCommandHandler(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<UserDto>> Handle(UpdateUserCommand request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, ct);
        if (user == null)
        {
            return ApiResponse<UserDto>.Fail(ResponseMessage.UserNotFound.GetDescription());
        }

        user.UpdateProfile(request.FirstName, request.LastName, request.EmployeeId);
        _userRepository.Update(user);

        var dto = _mapper.Map<UserDto>(user);
        return ApiResponse<UserDto>.Success(dto);
    }
}
