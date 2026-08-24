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
/// Command to update an existing department.
/// </summary>
public record UpdateDepartmentCommand(
    int Id,
    string Code,
    string Name,
    int? HeadEmployeeId,
    int? ParentDepartmentId) : IRequest<ApiResponse<DepartmentDto>>;

/// <summary>
/// Validator for <see cref="UpdateDepartmentCommand"/>.
/// </summary>
public class UpdateDepartmentCommandValidator : AbstractValidator<UpdateDepartmentCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="UpdateDepartmentCommand"/>.
    /// </summary>
    public UpdateDepartmentCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Department code is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200).WithMessage("Department name is required.");
    }
}

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
            return ApiResponse<DepartmentDto>.Fail("A department with this code already exists for this company.");
        }

        department.Update(request.Code, request.Name, request.HeadEmployeeId, request.ParentDepartmentId);
        _departmentRepository.Update(department);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<DepartmentDto>(department);
        return ApiResponse<DepartmentDto>.Success(dto, ResponseMessage.DepartmentUpdated.GetDescription());
    }
}
