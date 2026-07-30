using AutoMapper;
using MediatR;
using Workora.Application.Features.Users.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Queries.GetUserById;

/// <summary>
/// Handler for <see cref="GetUserByIdQuery"/>.
/// </summary>
public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, ApiResponse<UserDetailDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetUserByIdQueryHandler"/> class.
    /// </summary>
    /// <param name="userRepository">The user repository.</param>
    /// <param name="mapper">The mapper instance.</param>
    public GetUserByIdQueryHandler(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<UserDetailDto>> Handle(GetUserByIdQuery request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, ct);
        if (user == null)
        {
            return ApiResponse<UserDetailDto>.Fail($"User with ID {request.Id} was not found.");
        }

        var dto = _mapper.Map<UserDetailDto>(user);
        return ApiResponse<UserDetailDto>.Success(dto);
    }
}
