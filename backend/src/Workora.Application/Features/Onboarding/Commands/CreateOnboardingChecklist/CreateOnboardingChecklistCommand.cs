using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.Commands.CreateOnboardingChecklist;

/// <summary>
/// Command to create a new onboarding checklist item.
/// </summary>
public record CreateOnboardingChecklistCommand(
    string TaskName,
    string AssignedRole,
    bool IsMandatory = true) : IRequest<ApiResponse<OnboardingChecklistDto>>;
