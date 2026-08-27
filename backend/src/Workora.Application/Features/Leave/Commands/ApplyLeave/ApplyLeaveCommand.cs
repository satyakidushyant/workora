using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.ApplyLeave;

/// <summary>
/// Command to apply for leave.
/// </summary>
public record ApplyLeaveCommand(
    int LeaveTypeId,
    DateOnly StartDate,
    DateOnly EndDate,
    decimal DaysCount,
    string Reason) : IRequest<ApiResponse<LeaveRequestDto>>;
