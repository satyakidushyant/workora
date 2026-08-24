using AutoMapper;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Queries.GetAppraisalsList;

/// <summary>
/// Query to retrieve a paginated and filtered list of performance appraisals.
/// </summary>
public record GetAppraisalsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? EmployeeId = null,
    int? ReviewerId = null,
    int? Year = null,
    AppraisalStatus? Status = null) : IRequest<ApiResponse<PagedResponse<AppraisalDto>>>;

/// <summary>
/// Handler for <see cref="GetAppraisalsListQuery"/>.
/// </summary>
public class GetAppraisalsListQueryHandler : IRequestHandler<GetAppraisalsListQuery, ApiResponse<PagedResponse<AppraisalDto>>>
{
    private readonly IPerformanceRepository _performanceRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAppraisalsListQueryHandler"/> class.
    /// </summary>
    public GetAppraisalsListQueryHandler(IPerformanceRepository performanceRepository, IMapper mapper)
    {
        _performanceRepository = performanceRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<AppraisalDto>>> Handle(GetAppraisalsListQuery request, CancellationToken ct)
    {
        var appraisals = await _performanceRepository.GetAppraisalsPagedAsync(
            request.PageNumber,
            request.PageSize,
            request.EmployeeId,
            request.ReviewerId,
            request.Year,
            request.Status,
            ct);

        var totalCount = await _performanceRepository.GetAppraisalsCountAsync(
            request.EmployeeId,
            request.ReviewerId,
            request.Year,
            request.Status,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<AppraisalDto>>(appraisals);
        var paged = new PagedResponse<AppraisalDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<AppraisalDto>>.Success(paged);
    }
}
