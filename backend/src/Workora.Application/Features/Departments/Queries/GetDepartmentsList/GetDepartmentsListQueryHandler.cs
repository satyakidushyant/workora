using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Queries.GetDepartmentsList;

/// <summary>
/// Handler for <see cref="GetDepartmentsListQuery"/>.
/// </summary>
public class GetDepartmentsListQueryHandler : IRequestHandler<GetDepartmentsListQuery, ApiResponse<PagedResponse<DepartmentDto>>>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly ITenantResolutionService _tenantResolutionService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetDepartmentsListQueryHandler"/> class.
    /// </summary>
    public GetDepartmentsListQueryHandler(
        IDepartmentRepository departmentRepository,
        ITenantResolutionService tenantResolutionService,
        IMapper mapper)
    {
        _departmentRepository = departmentRepository;
        _tenantResolutionService = tenantResolutionService;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<DepartmentDto>>> Handle(GetDepartmentsListQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);

        var departments = await _departmentRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            targetCompanyId,
            ct);

        var totalCount = await _departmentRepository.GetCountAsync(
            request.SearchTerm,
            targetCompanyId,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<DepartmentDto>>(departments);
        var paged = new PagedResponse<DepartmentDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<DepartmentDto>>.Success(paged);
    }
}
