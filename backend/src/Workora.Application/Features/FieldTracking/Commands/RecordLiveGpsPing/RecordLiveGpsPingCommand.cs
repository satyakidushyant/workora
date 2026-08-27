using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.FieldTracking.DTOs;
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
