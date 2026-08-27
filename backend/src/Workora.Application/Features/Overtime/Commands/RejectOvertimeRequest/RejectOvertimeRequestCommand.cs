using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.Commands.RejectOvertimeRequest;

/// <summary>
/// Command to reject a pending overtime request.
/// </summary>
public record RejectOvertimeRequestCommand(
    int Id,
    string? Comments = null) : IRequest<ApiResponse<OvertimeRequestDto>>;
