using MediatR;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.DTOs;

/// <summary>
/// Summary report of distance traveled by field employee.
/// </summary>
public record TravelDistanceSummaryDto(int EmployeeId, decimal TotalDistanceKm, int TotalVisitsCount);
