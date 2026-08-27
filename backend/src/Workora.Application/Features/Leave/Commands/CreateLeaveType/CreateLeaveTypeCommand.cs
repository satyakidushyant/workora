using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.CreateLeaveType;

/// <summary>
/// Command to configure a new leave type.
/// </summary>
public record CreateLeaveTypeCommand(
    int CompanyId,
    string Name,
    string Code,
    decimal AnnualQuota,
    bool RequiresHrApproval,
    bool AllowNegativeBalance,
    string? Description) : IRequest<ApiResponse<LeaveTypeDto>>;
