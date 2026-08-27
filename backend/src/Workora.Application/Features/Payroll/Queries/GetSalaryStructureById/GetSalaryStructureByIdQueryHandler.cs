using AutoMapper;
using MediatR;
using Workora.Application.Features.Payroll.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.Queries.GetSalaryStructureById;

/// <summary>
/// Handler for <see cref="GetSalaryStructureByIdQuery"/>.
/// </summary>
public class GetSalaryStructureByIdQueryHandler : IRequestHandler<GetSalaryStructureByIdQuery, ApiResponse<SalaryStructureDto>>
{
    private readonly ISalaryStructureRepository _salaryStructureRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetSalaryStructureByIdQueryHandler"/> class.
    /// </summary>
    public GetSalaryStructureByIdQueryHandler(ISalaryStructureRepository salaryStructureRepository, IMapper mapper)
    {
        _salaryStructureRepository = salaryStructureRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<SalaryStructureDto>> Handle(GetSalaryStructureByIdQuery request, CancellationToken ct)
    {
        var structure = await _salaryStructureRepository.GetWithComponentsAsync(request.Id, ct);
        if (structure == null)
        {
            return ApiResponse<SalaryStructureDto>.Fail("Salary structure not found.");
        }

        var dto = _mapper.Map<SalaryStructureDto>(structure);
        return ApiResponse<SalaryStructureDto>.Success(dto);
    }
}
