using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Commands.CreateDepartment;

/// <summary>
/// Command to create a new organizational department.
/// </summary>
public record CreateDepartmentCommand(
    int CompanyId,
    string Code,
    string Name,
    int? HeadEmployeeId,
    int? ParentDepartmentId) : IRequest<ApiResponse<DepartmentDto>>;

/// <summary>
/// Validator for <see cref="CreateDepartmentCommand"/>.
/// </summary>
public class CreateDepartmentCommandValidator : AbstractValidator<CreateDepartmentCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CreateDepartmentCommand"/>.
    /// </summary>
    public CreateDepartmentCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Department code is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200).WithMessage("Department name is required.");
    }
}

/// <summary>
/// Handler for <see cref="CreateDepartmentCommand"/>.
/// </summary>
public class CreateDepartmentCommandHandler : IRequestHandler<CreateDepartmentCommand, ApiResponse<DepartmentDto>>
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateDepartmentCommandHandler"/> class.
    /// </summary>
    public CreateDepartmentCommandHandler(
        IDepartmentRepository departmentRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _departmentRepository = departmentRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<DepartmentDto>> Handle(CreateDepartmentCommand request, CancellationToken ct)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId, ct);
        if (company == null)
        {
            return ApiResponse<DepartmentDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var isUnique = await _departmentRepository.IsCodeUniqueAsync(request.CompanyId, request.Code, null, ct);
        if (!isUnique)
        {
            return ApiResponse<DepartmentDto>.Fail("A department with this code already exists for this company.");
        }

        var department = Department.Create(
            request.CompanyId,
            request.Code,
            request.Name,
            request.HeadEmployeeId,
            request.ParentDepartmentId);

        await _departmentRepository.AddAsync(department, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<DepartmentDto>(department);
        return ApiResponse<DepartmentDto>.Success(dto, ResponseMessage.DepartmentCreated.GetDescription());
    }
}
