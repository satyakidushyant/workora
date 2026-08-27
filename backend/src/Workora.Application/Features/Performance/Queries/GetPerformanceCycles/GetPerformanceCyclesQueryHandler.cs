using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Queries.GetPerformanceCycles;

/// <summary>
/// Handler for <see cref="GetPerformanceCyclesQuery"/>.
/// </summary>
public class GetPerformanceCyclesQueryHandler : IRequestHandler<GetPerformanceCyclesQuery, ApiResponse<IReadOnlyList<PerformanceCycleDto>>>
{
    private readonly IGenericRepository<Appraisal> _appraisalRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPerformanceCyclesQueryHandler"/> class.
    /// </summary>
    public GetPerformanceCyclesQueryHandler(IGenericRepository<Appraisal> appraisalRepository)
    {
        _appraisalRepository = appraisalRepository;
    }

    /// <summary>
    /// Executes retrieval of performance appraisal cycles.
    /// </summary>
    public Task<ApiResponse<IReadOnlyList<PerformanceCycleDto>>> Handle(GetPerformanceCyclesQuery request, CancellationToken cancellationToken)
    {
        var items = _appraisalRepository.GetQueryable()
            .ToList()
            .GroupBy(a => a.Period)
            .Select(g => new PerformanceCycleDto
            {
                Id = g.First().Id,
                CompanyId = request.CompanyId,
                Title = g.Key,
                Year = g.First().Year,
                IsActive = g.First().IsActive
            })
            .ToList();

        return Task.FromResult(ApiResponse<IReadOnlyList<PerformanceCycleDto>>.Success(items, ResponseMessage.PerformanceCyclesRetrieved.GetDescription()));
    }
}
