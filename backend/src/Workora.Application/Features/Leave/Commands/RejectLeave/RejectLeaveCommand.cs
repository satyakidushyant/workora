using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.RejectLeave;

/// <summary>
/// Command to reject a pending leave request.
/// </summary>
public record RejectLeaveCommand(
    int Id,
    string? Comments = null) : IRequest<ApiResponse<LeaveRequestDto>>;
