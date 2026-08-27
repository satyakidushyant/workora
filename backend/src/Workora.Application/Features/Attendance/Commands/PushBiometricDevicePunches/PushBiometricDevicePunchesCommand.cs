using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.PushBiometricDevicePunches;

/// <summary>
/// Command to ingest punch logs pushed from biometric hardware terminals.
/// </summary>
public record PushBiometricDevicePunchesCommand(List<BiometricPunchItemDto> Punches) : IRequest<ApiResponse<int>>;
