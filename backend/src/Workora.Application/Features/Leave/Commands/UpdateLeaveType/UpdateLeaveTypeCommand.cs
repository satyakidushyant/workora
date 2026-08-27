using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.UpdateLeaveType;

/// <summary>
/// Command to update an existing leave type definition.
/// </summary>
public record UpdateLeaveTypeCommand(
    int Id,
    string Name,
    string Code,
    decimal AnnualQuota,
    bool RequiresHrApproval,
    bool AllowNegativeBalance,
    string? Description) : IRequest<ApiResponse<LeaveTypeDto>>;
