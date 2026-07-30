using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Users.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Users.Queries.GetMyAccount;

/// <summary>
/// Handler for <see cref="GetMyAccountQuery"/>.
/// </summary>
public class GetMyAccountQueryHandler : IRequestHandler<GetMyAccountQuery, ApiResponse<UserDetailDto>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetMyAccountQueryHandler"/> class.
    /// </summary>
    /// <param name="currentUserService">The current user service.</param>
    /// <param name="userRepository">The user repository.</param>
    /// <param name="mapper">The mapper instance.</param>
    public GetMyAccountQueryHandler(
        ICurrentUserService currentUserService,
        IUserRepository userRepository,
        IMapper mapper)
    {
        _currentUserService = currentUserService;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<UserDetailDto>> Handle(GetMyAccountQuery request, CancellationToken ct)
    {
        var userUuid = _currentUserService.UserId;
        if (!userUuid.HasValue)
        {
            return ApiResponse<UserDetailDto>.Fail("User identity could not be resolved from token.");
        }

        var user = await _userRepository.GetByUuidAsync(userUuid.Value, ct);
        if (user == null)
        {
            return ApiResponse<UserDetailDto>.Fail("User account not found.");
        }

        var dto = _mapper.Map<UserDetailDto>(user);
        return ApiResponse<UserDetailDto>.Success(dto);
    }
}
