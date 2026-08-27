using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.ReactivateEmployee;

/// <summary>
/// Handler for <see cref="ReactivateEmployeeCommand"/>.
/// </summary>
public class ReactivateEmployeeCommandHandler : IRequestHandler<ReactivateEmployeeCommand, ApiResponse<EmployeeDto>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IDesignationRepository _designationRepository;
    private readonly IBranchRepository _branchRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="ReactivateEmployeeCommandHandler"/> class.
    /// </summary>
    public ReactivateEmployeeCommandHandler(
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
    public async Task<ApiResponse<EmployeeDto>> Handle(ReactivateEmployeeCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetWithFullDetailsAsync(request.Id, ct);
        if (employee == null)
        {
            return ApiResponse<EmployeeDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
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

        employee.Reactivate(request.DepartmentId, request.DesignationId, request.BranchId, request.ManagerId, request.Notes);
        _employeeRepository.Update(employee);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<EmployeeDto>(employee);
        return ApiResponse<EmployeeDto>.Success(dto, ResponseMessage.EmployeeReactivated.GetDescription());
    }
}
