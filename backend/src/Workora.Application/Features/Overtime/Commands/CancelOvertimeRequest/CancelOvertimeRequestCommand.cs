using AutoMapper;
using MediatR;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.Commands.CancelOvertimeRequest;

/// <summary>
/// Command to cancel an overtime request.
/// </summary>
public record CancelOvertimeRequestCommand(int Id) : IRequest<ApiResponse<OvertimeRequestDto>>;
