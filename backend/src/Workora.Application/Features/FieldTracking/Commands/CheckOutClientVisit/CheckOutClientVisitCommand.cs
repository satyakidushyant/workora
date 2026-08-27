using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.FieldTracking.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.Commands.CheckOutClientVisit;

/// <summary>
/// Command to check out from a client visit with final discussion notes.
/// </summary>
public record CheckOutClientVisitCommand(
    int VisitId,
    decimal Latitude,
    decimal Longitude,
    decimal DistanceTraveledKm,
    string? MeetingNotes,
    string? SignatureUrl) : IRequest<ApiResponse<FieldVisitDto>>;
