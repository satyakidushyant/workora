using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.Commands.RecordLiveGpsPing;

/// <summary>
/// Command to report periodic GPS telemetry from mobile device.
/// </summary>
public record RecordLiveGpsPingCommand(
    int EmployeeId,
    decimal Latitude,
    decimal Longitude,
    decimal AccuracyMeters,
    int BatteryPercentage) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Handler for <see cref="RecordLiveGpsPingCommand"/>.
/// </summary>
public class RecordLiveGpsPingCommandHandler : IRequestHandler<RecordLiveGpsPingCommand, ApiResponse<bool>>
{
    private readonly IFieldVisitRepository _fieldVisitRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public RecordLiveGpsPingCommandHandler(IFieldVisitRepository fieldVisitRepository, IUnitOfWork unitOfWork)
    {
        _fieldVisitRepository = fieldVisitRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(RecordLiveGpsPingCommand request, CancellationToken ct)
    {
        var ping = FieldGpsPing.Create(
            request.EmployeeId,
            request.Latitude,
            request.Longitude,
            DateTimeOffset.UtcNow,
            request.AccuracyMeters,
            request.BatteryPercentage);

        await _fieldVisitRepository.AddGpsPingAsync(ping, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, "GPS telemetry ping recorded.");
    }
}
