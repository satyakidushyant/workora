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

/// <summary>
/// Validator for <see cref="UpdateSubscriptionPlanCommand"/>.
/// </summary>
public class UpdateSubscriptionPlanCommandValidator : AbstractValidator<UpdateSubscriptionPlanCommand>
{
    /// <summary>
    /// Initializes validation rules for UpdateSubscriptionPlanCommand.
    /// </summary>
    public UpdateSubscriptionPlanCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid subscription plan ID is required.");
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Plan name is required.")
            .MaximumLength(100).WithMessage("Plan name must not exceed 100 characters.");
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative.");
        RuleFor(x => x.MaxEmployees).GreaterThan(0).WithMessage("Max employees must be greater than zero.");
    }
}

/// <summary>
/// Handler for <see cref="UpdateSubscriptionPlanCommand"/>.
/// </summary>
public class UpdateSubscriptionPlanCommandHandler : IRequestHandler<UpdateSubscriptionPlanCommand, ApiResponse<SubscriptionPlanDto>>
{
    private readonly IGenericRepository<SubscriptionPlan> _planRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateSubscriptionPlanCommandHandler"/> class.
    /// </summary>
    public UpdateSubscriptionPlanCommandHandler(
        IGenericRepository<SubscriptionPlan> planRepository,
        IUnitOfWork unitOfWork)
    {
        _planRepository = planRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes the update of a subscription plan.
    /// </summary>
    public async Task<ApiResponse<SubscriptionPlanDto>> Handle(UpdateSubscriptionPlanCommand request, CancellationToken cancellationToken)
    {
        var plan = await _planRepository.GetByIdAsync(request.Id, cancellationToken);
        if (plan == null)
        {
            return ApiResponse<SubscriptionPlanDto>.Fail("Subscription plan not found.");
        }

        plan.Update(
            request.Name,
            request.Description,
            request.Price,
            request.MaxEmployees,
            request.BillingCycle,
            request.IsActive);

        _planRepository.Update(plan);
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

        return ApiResponse<SubscriptionPlanDto>.Success(dto, "Subscription plan updated successfully.");
    }
}
