using AutoMapper;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.CancelLeave;

/// <summary>
/// Command to cancel a leave request.
/// </summary>
public record CancelLeaveCommand(int Id) : IRequest<ApiResponse<LeaveRequestDto>>;
