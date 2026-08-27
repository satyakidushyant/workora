using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.Commands.VerifyOnboardingItem;

/// <summary>
/// Command to verify an onboarding item for an employee.
/// </summary>
public record VerifyOnboardingItemCommand(
    int EmployeeId,
    int ChecklistId) : IRequest<ApiResponse<bool>>;
