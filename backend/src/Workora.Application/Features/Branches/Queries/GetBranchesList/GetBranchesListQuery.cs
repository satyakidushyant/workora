using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Queries.GetBranchesList;

/// <summary>
/// Query to get a paginated list of branches.
/// </summary>
public record GetBranchesListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    string? SearchTerm = null,
    bool? IsActive = null,
    int? CompanyId = null) : IRequest<ApiResponse<PagedResponse<BranchDto>>>;

/// <summary>
/// Handler for <see cref="GetBranchesListQuery"/>.
/// </summary>
public class GetBranchesListQueryHandler : IRequestHandler<GetBranchesListQuery, ApiResponse<PagedResponse<BranchDto>>>
{
    private readonly IBranchRepository _branchRepository;
    private readonly IUserRepository _userRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetBranchesListQueryHandler"/> class.
    /// </summary>
    public GetBranchesListQueryHandler(
        IBranchRepository branchRepository,
        IUserRepository userRepository,
        IEmployeeRepository employeeRepository,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _branchRepository = branchRepository;
        _userRepository = userRepository;
        _employeeRepository = employeeRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<BranchDto>>> Handle(GetBranchesListQuery request, CancellationToken ct)
    {
        int? targetCompanyId = request.CompanyId;

        // If not specified and user is not SuperAdmin, automatically scope to the user's company
        if (!targetCompanyId.HasValue && _currentUserService.UserId.HasValue && !_currentUserService.IsInRole("SuperAdmin"))
        {
            var user = await _userRepository.GetByUuidAsync(_currentUserService.UserId.Value, ct);
            if (user != null && user.EmployeeId.HasValue)
            {
                var employee = await _employeeRepository.GetWithFullDetailsAsync(user.EmployeeId.Value, ct);
                if (employee != null)
                {
                    targetCompanyId = employee.Department?.CompanyId ?? employee.Branch?.CompanyId;
                }
            }
        }

        var branches = await _branchRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            request.IsActive,
            targetCompanyId,
            ct);

        var totalCount = await _branchRepository.GetCountAsync(
            request.SearchTerm,
            request.IsActive,
            targetCompanyId,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<BranchDto>>(branches);
        var paged = new PagedResponse<BranchDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<BranchDto>>.Success(paged);
    }
}
