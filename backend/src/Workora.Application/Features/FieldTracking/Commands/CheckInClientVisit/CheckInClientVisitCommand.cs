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
