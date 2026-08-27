using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.SuperAdmin.Commands.CreateSubscriptionPlan;

/// <summary>
/// Command to create a new platform subscription plan.
/// </summary>
public record CreateSubscriptionPlanCommand(
    string Name,
    string Description,
    decimal Price,
    int MaxEmployees,
    SubscriptionBillingCycle BillingCycle) : IRequest<ApiResponse<SubscriptionPlanDto>>;
