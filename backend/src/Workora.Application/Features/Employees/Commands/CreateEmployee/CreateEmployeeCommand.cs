using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.CreateEmployee;

/// <summary>
/// Command to onboard a new employee into the system.
/// </summary>
public record CreateEmployeeCommand(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string NationalId,
    DateOnly DateOfBirth,
    Gender Gender,
    MaritalStatus MaritalStatus,
    DateOnly HireDate,
    int DepartmentId,
    int DesignationId,
    int BranchId,
    int? ManagerId,
    EmploymentType EmploymentType,
    string? Address) : IRequest<ApiResponse<EmployeeDto>>;

/// <summary>
/// Validator for <see cref="CreateEmployeeCommand"/>.
/// </summary>
public class CreateEmployeeCommandValidator : AbstractValidator<CreateEmployeeCommand>
{
    /// <summary>
    /// Initializes validation rules for onboarding an employee.
    /// </summary>
    public CreateEmployeeCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100).WithMessage("First name is required.");
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100).WithMessage("Last name is required.");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Valid email is required.");
        RuleFor(x => x.NationalId).NotEmpty().MaximumLength(50).WithMessage("National ID is required.");
        RuleFor(x => x.DepartmentId).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.DesignationId).GreaterThan(0).WithMessage("Valid designation ID is required.");
        RuleFor(x => x.BranchId).GreaterThan(0).WithMessage("Valid branch ID is required.");
        RuleFor(x => x.DateOfBirth)
            .Must((cmd, dob) => dob <= cmd.HireDate.AddYears(-18))
            .WithMessage("Employee must be at least 18 years old at the time of hire.");
    }
}

/// <summary>
/// Handler for <see cref="CreateEmployeeCommand"/>.
/// </summary>
public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, ApiResponse<EmployeeDto>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IDesignationRepository _designationRepository;
    private readonly IBranchRepository _branchRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateEmployeeCommandHandler"/> class.
    /// </summary>
    public CreateEmployeeCommandHandler(
        IEmployeeRepository employeeRepository,
        IDepartmentRepository departmentRepository,
        IDesignationRepository designationRepository,
        IBranchRepository branchRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _departmentRepository = departmentRepository;
        _designationRepository = designationRepository;
        _branchRepository = branchRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<EmployeeDto>> Handle(CreateEmployeeCommand request, CancellationToken ct)
    {
        EmailAddress emailObj;
        try
        {
            emailObj = EmailAddress.Create(request.Email);
        }
        catch (ArgumentException ex)
        {
            return ApiResponse<EmployeeDto>.Fail(ex.Message);
        }

        var isEmailUnique = await _employeeRepository.IsEmailUniqueAsync(emailObj, null, ct);
        if (!isEmailUnique)
        {
            return ApiResponse<EmployeeDto>.Fail("An employee with this email already exists.");
        }

        var isNationalIdUnique = await _employeeRepository.IsNationalIdUniqueAsync(request.NationalId, null, ct);
        if (!isNationalIdUnique)
        {
            return ApiResponse<EmployeeDto>.Fail("An employee with this national ID already exists.");
        }

        var department = await _departmentRepository.GetByIdAsync(request.DepartmentId, ct);
        if (department == null)
        {
            return ApiResponse<EmployeeDto>.Fail(ResponseMessage.DepartmentNotFound.GetDescription());
        }

        var designation = await _designationRepository.GetByIdAsync(request.DesignationId, ct);
        if (designation == null)
        {
            return ApiResponse<EmployeeDto>.Fail(ResponseMessage.DesignationNotFound.GetDescription());
        }

        var branch = await _branchRepository.GetByIdAsync(request.BranchId, ct);
        if (branch == null)
        {
            return ApiResponse<EmployeeDto>.Fail(ResponseMessage.BranchNotFound.GetDescription());
        }

        var year = request.HireDate.Year;
        var seq = await _employeeRepository.GetCountForCodeGenerationAsync(year, ct) + 1;
        var employeeCode = $"EMP-{year}-{seq:D4}";

        var employee = Employee.Create(
            employeeCode,
            request.FirstName,
            request.LastName,
            emailObj,
            request.Phone,
            request.NationalId,
            request.DateOfBirth,
            request.Gender,
            request.MaritalStatus,
            request.HireDate,
            request.DepartmentId,
            request.DesignationId,
            request.BranchId,
            request.ManagerId,
            null,
            EmploymentStatus.Active,
            request.EmploymentType,
            request.Address);

        await _employeeRepository.AddAsync(employee, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var fullyLoaded = await _employeeRepository.GetWithFullDetailsAsync(employee.Id, ct);
        var dto = _mapper.Map<EmployeeDto>(fullyLoaded ?? employee);
        return ApiResponse<EmployeeDto>.Success(dto, ResponseMessage.EmployeeCreated.GetDescription());
    }
}
