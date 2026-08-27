using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.Commands.CreateOvertimeRequest;

/// <summary>
/// Command to create a new overtime request.
/// </summary>
public record CreateOvertimeRequestCommand(
    int EmployeeId,
    DateOnly OvertimeDate,
    TimeOnly StartTime,
    TimeOnly EndTime,
    decimal HoursRequested,
    string Reason) : IRequest<ApiResponse<OvertimeRequestDto>>;
