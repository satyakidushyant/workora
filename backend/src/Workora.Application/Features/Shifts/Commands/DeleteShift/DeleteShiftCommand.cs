using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Shifts.DTOs;
namespace Workora.Application.Features.Shifts.Commands.DeleteShift;

/// <summary>
/// Command to delete a shift.
/// </summary>
public record DeleteShiftCommand(int Id) : IRequest<ApiResponse<bool>>;
