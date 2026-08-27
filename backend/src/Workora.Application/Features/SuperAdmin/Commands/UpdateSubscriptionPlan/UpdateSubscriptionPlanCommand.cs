using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.UpdateSubscriptionPlan;

/// <summary>
/// Command to update an existing platform subscription plan.
/// </summary>
public record UpdateSubscriptionPlanCommand(
    int Id,
    string Name,
    string Description,
    decimal Price,
    int MaxEmployees,
    SubscriptionBillingCycle BillingCycle,
    bool IsActive = true) : IRequest<ApiResponse<SubscriptionPlanDto>>;
