using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.UpdateEmployee;

/// <summary>
/// Handler for <see cref="UpdateEmployeeCommand"/>.
/// </summary>
public class UpdateEmployeeCommandHandler : IRequestHandler<UpdateEmployeeCommand, ApiResponse<EmployeeDto>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateEmployeeCommandHandler"/> class.
    /// </summary>
    public UpdateEmployeeCommandHandler(
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<EmployeeDto>> Handle(UpdateEmployeeCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.Id, ct);
        if (employee == null)
        {
            return ApiResponse<EmployeeDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        if (request.ManagerId.HasValue && request.ManagerId.Value == request.Id)
        {
            return ApiResponse<EmployeeDto>.Fail("An employee cannot be their own manager.");
        }

        employee.UpdateProfile(
            request.FirstName,
            request.LastName,
            request.Phone,
            request.DateOfBirth,
            request.Gender,
            request.MaritalStatus,
            request.ManagerId,
            request.Address);

        _employeeRepository.Update(employee);
        await _unitOfWork.SaveChangesAsync(ct);

        var fullyLoaded = await _employeeRepository.GetWithFullDetailsAsync(employee.Id, ct);
        var dto = _mapper.Map<EmployeeDto>(fullyLoaded ?? employee);
        return ApiResponse<EmployeeDto>.Success(dto, ResponseMessage.EmployeeUpdated.GetDescription());
    }
}
