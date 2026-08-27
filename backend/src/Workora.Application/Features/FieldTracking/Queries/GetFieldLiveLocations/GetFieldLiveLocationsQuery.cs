using AutoMapper;
using MediatR;
using Workora.Application.Features.FieldTracking.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.Queries.GetFieldLiveLocations;

/// <summary>
/// Query to get real-time live GPS map coordinates of active field agents.
/// </summary>
public record GetFieldLiveLocationsQuery : IRequest<ApiResponse<List<LiveLocationDto>>>;
