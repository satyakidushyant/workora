using AutoMapper;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Queries.GetAppraisalById;

/// <summary>
/// Handler for <see cref="GetAppraisalByIdQuery"/>.
/// </summary>
public class GetAppraisalByIdQueryHandler : IRequestHandler<GetAppraisalByIdQuery, ApiResponse<AppraisalDto>>
{
    private readonly IPerformanceRepository _performanceRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAppraisalByIdQueryHandler"/> class.
    /// </summary>
    public GetAppraisalByIdQueryHandler(IPerformanceRepository performanceRepository, IMapper mapper)
    {
        _performanceRepository = performanceRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AppraisalDto>> Handle(GetAppraisalByIdQuery request, CancellationToken ct)
    {
        var appraisal = await _performanceRepository.GetAppraisalWithDetailsAsync(request.Id, ct);
        if (appraisal == null)
        {
            return ApiResponse<AppraisalDto>.Fail("Appraisal record not found.");
        }

        var dto = _mapper.Map<AppraisalDto>(appraisal);
        return ApiResponse<AppraisalDto>.Success(dto);
    }
}
