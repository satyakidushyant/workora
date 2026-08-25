using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.FieldTracking.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.Commands.CheckInClientVisit;

/// <summary>
/// Command to check in at a client location for a field meeting.
/// </summary>
public record CheckInClientVisitCommand(
    int EmployeeId,
    string ClientName,
    string VisitPurpose,
    decimal Latitude,
    decimal Longitude,
    string Address) : IRequest<ApiResponse<FieldVisitDto>>;

/// <summary>
/// Validator for <see cref="CheckInClientVisitCommand"/>.
/// </summary>
public class CheckInClientVisitCommandValidator : AbstractValidator<CheckInClientVisitCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public CheckInClientVisitCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid EmployeeId is required.");
        RuleFor(x => x.ClientName).NotEmpty().MaximumLength(150).WithMessage("Client name is required.");
        RuleFor(x => x.VisitPurpose).NotEmpty().MaximumLength(250).WithMessage("Visit purpose is required.");
        RuleFor(x => x.Address).NotEmpty().MaximumLength(300).WithMessage("Address is required.");
    }
}

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
            return ApiResponse<FieldVisitDto>.Fail("Employee not found.");
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
        return ApiResponse<FieldVisitDto>.Success(dto, "Visit check-in recorded successfully.");
    }
}
