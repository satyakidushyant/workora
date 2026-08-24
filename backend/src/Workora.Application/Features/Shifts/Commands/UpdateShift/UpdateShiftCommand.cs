using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Commands.UpdateShift;

/// <summary>
/// Command to update an existing shift.
/// </summary>
public record UpdateShiftCommand(
    int Id,
    string Name,
    string Code,
    TimeOnly StartTime,
    TimeOnly EndTime,
    bool SpansMidnight,
    int GracePeriodMinutes,
    int BreakMinutes,
    int? BranchId,
    string? Description) : IRequest<ApiResponse<ShiftDto>>;

/// <summary>
/// Validator for <see cref="UpdateShiftCommand"/>.
/// </summary>
public class UpdateShiftCommandValidator : AbstractValidator<UpdateShiftCommand>
{
    /// <summary>
    /// Initializes validation rules for updating a shift.
    /// </summary>
    public UpdateShiftCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid shift ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100).WithMessage("Shift name is required.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Shift code is required.");
    }
}

/// <summary>
/// Handler for <see cref="UpdateShiftCommand"/>.
/// </summary>
public class UpdateShiftCommandHandler : IRequestHandler<UpdateShiftCommand, ApiResponse<ShiftDto>>
{
    private readonly IShiftRepository _shiftRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateShiftCommandHandler"/> class.
    /// </summary>
    public UpdateShiftCommandHandler(
        IShiftRepository shiftRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _shiftRepository = shiftRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<ShiftDto>> Handle(UpdateShiftCommand request, CancellationToken ct)
    {
        var shift = await _shiftRepository.GetByIdAsync(request.Id, ct);
        if (shift == null)
        {
            return ApiResponse<ShiftDto>.Fail(ResponseMessage.ShiftNotFound.GetDescription());
        }

        var isUnique = await _shiftRepository.IsCodeUniqueAsync(shift.CompanyId, request.Code, request.Id, ct);
        if (!isUnique)
        {
            return ApiResponse<ShiftDto>.Fail("A shift with this code already exists for the company.");
        }

        shift.Update(
            request.Name,
            request.Code,
            request.StartTime,
            request.EndTime,
            request.SpansMidnight,
            request.GracePeriodMinutes,
            request.BreakMinutes,
            request.BranchId,
            request.Description);

        _shiftRepository.Update(shift);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<ShiftDto>(shift);
        return ApiResponse<ShiftDto>.Success(dto, ResponseMessage.ShiftUpdated.GetDescription());
    }
}
