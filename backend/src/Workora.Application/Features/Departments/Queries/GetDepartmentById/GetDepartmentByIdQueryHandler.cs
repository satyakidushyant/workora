using AutoMapper;
using MediatR;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Queries.GetDepartmentById;

/// <summary>
/// Handler for <see cref="GetDepartmentByIdQuery"/>.
/// </summary>
public class GetDepartmentByIdQueryHandler : IRequestHandler<GetDepartmentByIdQuery, ApiResponse<DepartmentDetailDto>>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetDepartmentByIdQueryHandler"/> class.
    /// </summary>
    public GetDepartmentByIdQueryHandler(IDepartmentRepository departmentRepository, IMapper mapper)
    {
        _departmentRepository = departmentRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<DepartmentDetailDto>> Handle(GetDepartmentByIdQuery request, CancellationToken ct)
    {
        var department = await _departmentRepository.GetWithDetailsAsync(request.Id, ct);
        if (department == null)
        {
            return ApiResponse<DepartmentDetailDto>.Fail("Department not found.");
        }

        var dto = _mapper.Map<DepartmentDetailDto>(department);
        return ApiResponse<DepartmentDetailDto>.Success(dto);
    }
}
