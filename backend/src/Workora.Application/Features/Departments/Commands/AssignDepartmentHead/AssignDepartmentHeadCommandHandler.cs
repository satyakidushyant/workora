using AutoMapper;
using MediatR;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Commands.AssignDepartmentHead;

/// <summary>
/// Handler for <see cref="AssignDepartmentHeadCommand"/>.
/// </summary>
public class AssignDepartmentHeadCommandHandler : IRequestHandler<AssignDepartmentHeadCommand, ApiResponse<DepartmentDto>>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="AssignDepartmentHeadCommandHandler"/> class.
    /// </summary>
    public AssignDepartmentHeadCommandHandler(
        IDepartmentRepository departmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _departmentRepository = departmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<DepartmentDto>> Handle(AssignDepartmentHeadCommand request, CancellationToken ct)
    {
        var department = await _departmentRepository.GetByIdAsync(request.Id, ct);
        if (department == null)
        {
            return ApiResponse<DepartmentDto>.Fail(ResponseMessage.DepartmentNotFound.GetDescription());
        }

        department.AssignHead(request.HeadEmployeeId);
        _departmentRepository.Update(department);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<DepartmentDto>(department);
        return ApiResponse<DepartmentDto>.Success(dto, ResponseMessage.DepartmentUpdated.GetDescription());
    }
}
