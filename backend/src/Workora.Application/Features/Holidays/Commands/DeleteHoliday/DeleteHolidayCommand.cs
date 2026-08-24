using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Commands.DeleteHoliday;

/// <summary>
/// Command to delete a holiday definition.
/// </summary>
public record DeleteHolidayCommand(int Id) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Handler for <see cref="DeleteHolidayCommand"/>.
/// </summary>
public class DeleteHolidayCommandHandler : IRequestHandler<DeleteHolidayCommand, ApiResponse<bool>>
{
    private readonly IHolidayRepository _holidayRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteHolidayCommandHandler"/> class.
    /// </summary>
    public DeleteHolidayCommandHandler(IHolidayRepository holidayRepository, IUnitOfWork unitOfWork)
    {
        _holidayRepository = holidayRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(DeleteHolidayCommand request, CancellationToken ct)
    {
        var holiday = await _holidayRepository.GetByIdAsync(request.Id, ct);
        if (holiday == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.HolidayNotFound.GetDescription());
        }

        _holidayRepository.Remove(holiday);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.HolidayDeleted.GetDescription());
    }
}
