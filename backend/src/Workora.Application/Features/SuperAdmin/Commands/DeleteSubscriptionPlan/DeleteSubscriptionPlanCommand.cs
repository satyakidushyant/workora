using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.SuperAdmin.DTOs;
namespace Workora.Application.Features.SuperAdmin.Commands.DeleteSubscriptionPlan;

/// <summary>
/// Command to delete a platform subscription plan.
/// </summary>
public record DeleteSubscriptionPlanCommand(int Id) : IRequest<ApiResponse<bool>>;
