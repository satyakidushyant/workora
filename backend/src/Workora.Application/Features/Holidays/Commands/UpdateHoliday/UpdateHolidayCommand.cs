using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Commands.UpdateHoliday;

/// <summary>
/// Command to update an existing holiday.
/// </summary>
public record UpdateHolidayCommand(
    int Id,
    string Name,
    DateOnly Date,
    HolidayType Type,
    int? BranchId,
    string? Description) : IRequest<ApiResponse<HolidayDto>>;

/// <summary>
/// Validator for <see cref="UpdateHolidayCommand"/>.
/// </summary>
public class UpdateHolidayCommandValidator : AbstractValidator<UpdateHolidayCommand>
{
    /// <summary>
    /// Initializes validation rules for updating a holiday.
    /// </summary>
    public UpdateHolidayCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid holiday ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150).WithMessage("Holiday name is required.");
    }
}

/// <summary>
/// Handler for <see cref="UpdateHolidayCommand"/>.
/// </summary>
public class UpdateHolidayCommandHandler : IRequestHandler<UpdateHolidayCommand, ApiResponse<HolidayDto>>
{
    private readonly IHolidayRepository _holidayRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateHolidayCommandHandler"/> class.
    /// </summary>
    public UpdateHolidayCommandHandler(
        IHolidayRepository holidayRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _holidayRepository = holidayRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<HolidayDto>> Handle(UpdateHolidayCommand request, CancellationToken ct)
    {
        var holiday = await _holidayRepository.GetByIdAsync(request.Id, ct);
        if (holiday == null)
        {
            return ApiResponse<HolidayDto>.Fail(ResponseMessage.HolidayNotFound.GetDescription());
        }

        var isUnique = await _holidayRepository.IsDateUniqueAsync(holiday.CompanyId, request.Date, request.BranchId, request.Id, ct);
        if (!isUnique)
        {
            return ApiResponse<HolidayDto>.Fail("A holiday is already configured for this date and scope.");
        }

        holiday.Update(request.Name, request.Date, request.Type, request.BranchId, request.Description);
        _holidayRepository.Update(holiday);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<HolidayDto>(holiday);
        return ApiResponse<HolidayDto>.Success(dto, ResponseMessage.HolidayUpdated.GetDescription());
    }
}
