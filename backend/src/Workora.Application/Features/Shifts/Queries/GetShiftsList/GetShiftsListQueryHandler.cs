using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Queries.GetShiftsList;

/// <summary>
/// Handler for <see cref="GetShiftsListQuery"/>.
/// </summary>
public class GetShiftsListQueryHandler : IRequestHandler<GetShiftsListQuery, ApiResponse<PagedResponse<ShiftDto>>>
{
    private readonly IShiftRepository _shiftRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetShiftsListQueryHandler"/> class.
    /// </summary>
    public GetShiftsListQueryHandler(
        IShiftRepository shiftRepository,
        ITenantResolutionService tenantResolutionService,
        IMapper mapper)
    {
        _shiftRepository = shiftRepository;
        _tenantResolutionService = tenantResolutionService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<ShiftDto>>> Handle(GetShiftsListQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);

        var shifts = await _shiftRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            targetCompanyId,
            ct);

        var totalCount = await _shiftRepository.GetCountAsync(
            request.SearchTerm,
            targetCompanyId,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<ShiftDto>>(shifts);
        var paged = new PagedResponse<ShiftDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<ShiftDto>>.Success(paged);
    }
}
