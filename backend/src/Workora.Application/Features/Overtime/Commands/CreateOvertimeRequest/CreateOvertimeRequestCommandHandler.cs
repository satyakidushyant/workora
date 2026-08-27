using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.Commands.CreateOvertimeRequest;

/// <summary>
/// Handler for <see cref="CreateOvertimeRequestCommand"/>.
/// </summary>
public class CreateOvertimeRequestCommandHandler : IRequestHandler<CreateOvertimeRequestCommand, ApiResponse<OvertimeRequestDto>>
{
    private readonly IOvertimeRequestRepository _overtimeRequestRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateOvertimeRequestCommandHandler"/> class.
    /// </summary>
    public CreateOvertimeRequestCommandHandler(
        IOvertimeRequestRepository overtimeRequestRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _overtimeRequestRepository = overtimeRequestRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<OvertimeRequestDto>> Handle(CreateOvertimeRequestCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<OvertimeRequestDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var hasOverlap = await _overtimeRequestRepository.HasOverlappingRequestAsync(request.EmployeeId, request.OvertimeDate, null, ct);
        if (hasOverlap)
        {
            return ApiResponse<OvertimeRequestDto>.Fail("An overtime request already exists for this employee on this date.");
        }

        var overtimeRequest = OvertimeRequest.Create(
            request.EmployeeId,
            request.OvertimeDate,
            request.StartTime,
            request.EndTime,
            request.HoursRequested,
            request.Reason);

        await _overtimeRequestRepository.AddAsync(overtimeRequest, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var loaded = await _overtimeRequestRepository.GetWithDetailsAsync(overtimeRequest.Id, ct);
        var dto = _mapper.Map<OvertimeRequestDto>(loaded ?? overtimeRequest);
        return ApiResponse<OvertimeRequestDto>.Success(dto, ResponseMessage.Created.GetDescription());
    }
}
