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

/// <summary>
/// Validator for <see cref="CreateSubscriptionPlanCommand"/>.
/// </summary>
public class CreateSubscriptionPlanCommandValidator : AbstractValidator<CreateSubscriptionPlanCommand>
{
    /// <summary>
    /// Initializes validation rules for CreateSubscriptionPlanCommand.
    /// </summary>
    public CreateSubscriptionPlanCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Plan name is required.")
            .MaximumLength(100).WithMessage("Plan name must not exceed 100 characters.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative.");

        RuleFor(x => x.MaxEmployees)
            .GreaterThan(0).WithMessage("Max employees must be greater than zero.");
    }
}

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
