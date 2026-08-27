using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.PromoteEmployee;

/// <summary>
/// Handler for <see cref="PromoteEmployeeCommand"/>.
/// </summary>
public class PromoteEmployeeCommandHandler : IRequestHandler<PromoteEmployeeCommand, ApiResponse<EmployeeDto>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IDesignationRepository _designationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="PromoteEmployeeCommandHandler"/> class.
    /// </summary>
    public PromoteEmployeeCommandHandler(
        IEmployeeRepository employeeRepository,
        IDesignationRepository designationRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _designationRepository = designationRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<EmployeeDto>> Handle(PromoteEmployeeCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetWithFullDetailsAsync(request.Id, ct);
        if (employee == null)
        {
            return ApiResponse<EmployeeDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        if (employee.EmploymentStatus != EmploymentStatus.Active)
        {
            return ApiResponse<EmployeeDto>.Fail("Only active employees can be promoted.");
        }

        var newDesignation = await _designationRepository.GetByIdAsync(request.NewDesignationId, ct);
        if (newDesignation == null)
        {
            return ApiResponse<EmployeeDto>.Fail(ResponseMessage.DesignationNotFound.GetDescription());
        }

        if (employee.DesignationId == request.NewDesignationId)
        {
            return ApiResponse<EmployeeDto>.Fail("Employee is already at the target designation.");
        }

        employee.Transfer(
            employee.DepartmentId,
            request.NewDesignationId,
            employee.BranchId,
            employee.ManagerId,
            request.Remarks ?? $"Promoted to {newDesignation.Title}");

        _employeeRepository.Update(employee);
        await _unitOfWork.SaveChangesAsync(ct);

        var fullyLoaded = await _employeeRepository.GetWithFullDetailsAsync(employee.Id, ct);
        var dto = _mapper.Map<EmployeeDto>(fullyLoaded ?? employee);
        return ApiResponse<EmployeeDto>.Success(dto, ResponseMessage.EmployeeUpdated.GetDescription());
    }
}
