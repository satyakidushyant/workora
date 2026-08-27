using AutoMapper;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.FieldTracking.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.Commands.CheckInClientVisit;

/// <summary>
/// Handler for <see cref="CheckInClientVisitCommand"/>.
/// </summary>
public class CheckInClientVisitCommandHandler : IRequestHandler<CheckInClientVisitCommand, ApiResponse<FieldVisitDto>>
{
    private readonly IFieldVisitRepository _fieldVisitRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public CheckInClientVisitCommandHandler(
        IFieldVisitRepository fieldVisitRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _fieldVisitRepository = fieldVisitRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<FieldVisitDto>> Handle(CheckInClientVisitCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<FieldVisitDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var visit = FieldVisit.CheckIn(
            request.EmployeeId,
            request.ClientName,
            request.VisitPurpose,
            request.Latitude,
            request.Longitude,
            request.Address);

        await _fieldVisitRepository.AddAsync(visit, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<FieldVisitDto>(visit);
        return ApiResponse<FieldVisitDto>.Success(dto, ResponseMessage.FieldVisitCheckedIn.GetDescription());
    }
}
