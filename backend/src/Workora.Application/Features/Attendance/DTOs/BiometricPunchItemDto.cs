using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Attendance.DTOs;

/// <summary>
/// DTO representing a raw punch record from a hardware biometric machine.
/// </summary>
public record BiometricPunchItemDto(
    string EmployeeCode,
    DateTimeOffset PunchTimestamp,
    string PunchType,
    string? DeviceId);
