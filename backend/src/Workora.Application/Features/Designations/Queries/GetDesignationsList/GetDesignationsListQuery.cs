using AutoMapper;
using MediatR;
using Workora.Application.Features.Designations.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.Queries.GetDesignationsList;

/// <summary>
/// Query to get a paginated list of designations.
/// </summary>
public record GetDesignationsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    string? SearchTerm = null,
    int? DepartmentId = null) : IRequest<ApiResponse<PagedResponse<DesignationDto>>>;

/// <summary>
/// Handler for <see cref="GetDesignationsListQuery"/>.
/// </summary>
public class GetDesignationsListQueryHandler : IRequestHandler<GetDesignationsListQuery, ApiResponse<PagedResponse<DesignationDto>>>
{
    private readonly IDesignationRepository _designationRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetDesignationsListQueryHandler"/> class.
    /// </summary>
    public GetDesignationsListQueryHandler(IDesignationRepository designationRepository, IMapper mapper)
    {
        _designationRepository = designationRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<DesignationDto>>> Handle(GetDesignationsListQuery request, CancellationToken ct)
    {
        var designations = await _designationRepository.GetPagedListAsync(
            request.PageNumber,
            request.PageSize,
            request.SearchTerm,
            request.DepartmentId,
            ct);

        var totalCount = await _designationRepository.GetCountAsync(
            request.SearchTerm,
            request.DepartmentId,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<DesignationDto>>(designations);
        var paged = new PagedResponse<DesignationDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<DesignationDto>>.Success(paged);
    }
}
