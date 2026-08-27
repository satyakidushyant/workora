using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetSalaryStructuresList;

/// <summary>
/// Handler for <see cref="GetSalaryStructuresListQuery"/>.
/// </summary>
public class GetSalaryStructuresListQueryHandler : IRequestHandler<GetSalaryStructuresListQuery, ApiResponse<IReadOnlyList<SalaryStructureDto>>>
{
    private readonly ISalaryStructureRepository _salaryStructureRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetSalaryStructuresListQueryHandler"/> class.
    /// </summary>
    public GetSalaryStructuresListQueryHandler(ISalaryStructureRepository salaryStructureRepository, IMapper mapper)
    {
        _salaryStructureRepository = salaryStructureRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<IReadOnlyList<SalaryStructureDto>>> Handle(GetSalaryStructuresListQuery request, CancellationToken ct)
    {
        var structures = await _salaryStructureRepository.GetByCompanyIdAsync(request.CompanyId, ct);
        var dtos = _mapper.Map<IReadOnlyList<SalaryStructureDto>>(structures);
        return ApiResponse<IReadOnlyList<SalaryStructureDto>>.Success(dtos);
    }
}
