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
/// Handler for <see cref="CreateSubscriptionPlanCommand"/>.
/// </summary>
public class CreateSubscriptionPlanCommandHandler : IRequestHandler<CreateSubscriptionPlanCommand, ApiResponse<SubscriptionPlanDto>>
{
    private readonly IGenericRepository<SubscriptionPlan> _planRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateSubscriptionPlanCommandHandler"/> class.
    /// </summary>
    public CreateSubscriptionPlanCommandHandler(
        IGenericRepository<SubscriptionPlan> planRepository,
        IUnitOfWork unitOfWork)
    {
        _planRepository = planRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes the creation of a subscription plan.
    /// </summary>
    public async Task<ApiResponse<SubscriptionPlanDto>> Handle(CreateSubscriptionPlanCommand request, CancellationToken cancellationToken)
    {
        var plan = SubscriptionPlan.Create(
            request.Name,
            request.Description,
            request.Price,
            request.MaxEmployees,
            request.BillingCycle);

        await _planRepository.AddAsync(plan, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = new SubscriptionPlanDto
        {
            Id = plan.Id,
            Name = plan.Name,
            Description = plan.Description,
            Price = plan.Price,
            MaxEmployees = plan.MaxEmployees,
            BillingCycle = plan.BillingCycle,
            IsActive = plan.IsActive
        };

        return ApiResponse<SubscriptionPlanDto>.Success(dto, "Subscription plan created successfully.");
    }
}
