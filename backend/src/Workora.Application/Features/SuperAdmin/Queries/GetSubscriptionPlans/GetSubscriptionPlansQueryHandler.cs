using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.SuperAdmin.Queries.GetSubscriptionPlans;

/// <summary>
/// Handler for <see cref="GetSubscriptionPlansQuery"/>.
/// </summary>
public class GetSubscriptionPlansQueryHandler : IRequestHandler<GetSubscriptionPlansQuery, ApiResponse<IReadOnlyList<SubscriptionPlanDto>>>
{
    private readonly IGenericRepository<SubscriptionPlan> _planRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetSubscriptionPlansQueryHandler"/> class.
    /// </summary>
    public GetSubscriptionPlansQueryHandler(IGenericRepository<SubscriptionPlan> planRepository)
    {
        _planRepository = planRepository;
    }

    /// <summary>
    /// Handles fetching subscription plans list.
    /// </summary>
    public Task<ApiResponse<IReadOnlyList<SubscriptionPlanDto>>> Handle(GetSubscriptionPlansQuery request, CancellationToken cancellationToken)
    {
        var plans = _planRepository.GetQueryable().ToList()
            .Select(p => new SubscriptionPlanDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description ?? string.Empty,
                Price = p.Price,
                MaxEmployees = p.MaxEmployees,
                BillingCycle = p.BillingCycle,
                IsActive = p.IsActive
            })
            .ToList();

        return Task.FromResult(ApiResponse<IReadOnlyList<SubscriptionPlanDto>>.Success(plans, "Subscription plans retrieved successfully."));
    }
}
