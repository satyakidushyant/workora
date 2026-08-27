using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.SuperAdmin.Queries.GetSubscriptionPlans;

/// <summary>
/// Query to retrieve all available SaaS subscription plans.
/// </summary>
public record GetSubscriptionPlansQuery : IRequest<ApiResponse<IReadOnlyList<SubscriptionPlanDto>>>;
