using AutoMapper;
using MediatR;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Queries.GetDepartmentsList;

/// <summary>
/// Query to get a paginated list of departments.
/// </summary>
public record GetDepartmentsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    string? SearchTerm = null,
    int? CompanyId = null) : IRequest<ApiResponse<PagedResponse<DepartmentDto>>>;

/// <summary>
/// Handler for <see cref="GetDepartmentsListQuery"/>.
/// </summary>
public class GetDepartmentsListQueryHandler : IRequestHandler<GetDepartmentsListQuery, ApiResponse<PagedResponse<DepartmentDto>>>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetDepartmentsListQueryHandler"/> class.
    /// </summary>
    public GetDepartmentsListQueryHandler(IDepartmentRepository departmentRepository, IMapper mapper)
    {
        _departmentRepository = departmentRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<DepartmentDto>>> Handle(GetDepartmentsListQuery request, CancellationToken ct)
    {
        var departments = await _departmentRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            request.CompanyId,
            ct);

        var totalCount = await _departmentRepository.GetCountAsync(
            request.SearchTerm,
            request.CompanyId,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<DepartmentDto>>(departments);
        var paged = new PagedResponse<DepartmentDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<DepartmentDto>>.Success(paged);
    }
}
