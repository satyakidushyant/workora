using AutoMapper;
using MediatR;
using Workora.Application.Features.FinancialYears.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FinancialYears.Queries.GetFinancialYearsList;

/// <summary>
/// Handler for <see cref="GetFinancialYearsListQuery"/>.
/// </summary>
public class GetFinancialYearsListQueryHandler : IRequestHandler<GetFinancialYearsListQuery, ApiResponse<IReadOnlyList<FinancialYearDto>>>
{
    private readonly IFinancialYearRepository _financialYearRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetFinancialYearsListQueryHandler"/> class.
    /// </summary>
    public GetFinancialYearsListQueryHandler(IFinancialYearRepository financialYearRepository, IMapper mapper)
    {
        _financialYearRepository = financialYearRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<FinancialYearDto>>> Handle(GetFinancialYearsListQuery request, CancellationToken ct)
    {
        var years = await _financialYearRepository.GetByCompanyIdAsync(0, ct);
        var dtos = _mapper.Map<IReadOnlyList<FinancialYearDto>>(years);
        return ApiResponse<IReadOnlyList<FinancialYearDto>>.Success(dtos);
    }
}
