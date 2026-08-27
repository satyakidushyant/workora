using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Commands.UpdateDepartment;

/// <summary>
/// Handler for <see cref="UpdateDepartmentCommand"/>.
/// </summary>
public class UpdateDepartmentCommandHandler : IRequestHandler<UpdateDepartmentCommand, ApiResponse<DepartmentDto>>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateDepartmentCommandHandler"/> class.
    /// </summary>
    public UpdateDepartmentCommandHandler(
        IDepartmentRepository departmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _departmentRepository = departmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<DepartmentDto>> Handle(UpdateDepartmentCommand request, CancellationToken ct)
    {
        var department = await _departmentRepository.GetByIdAsync(request.Id, ct);
        if (department == null)
        {
            return ApiResponse<DepartmentDto>.Fail(ResponseMessage.DepartmentNotFound.GetDescription());
        }

        var isUnique = await _departmentRepository.IsCodeUniqueAsync(department.CompanyId, request.Code, request.Id, ct);
        if (!isUnique)
        {
            return ApiResponse<DepartmentDto>.Fail(ResponseMessage.DepartmentCodeAlreadyExists.GetDescription());
        }

        department.Update(request.Code, request.Name, request.HeadEmployeeId, request.ParentDepartmentId);
        _departmentRepository.Update(department);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<DepartmentDto>(department);
        return ApiResponse<DepartmentDto>.Success(dto, ResponseMessage.DepartmentUpdated.GetDescription());
    }
}
