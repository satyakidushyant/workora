using FluentValidation;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.SuperAdmin.DTOs;
namespace Workora.Application.Features.SuperAdmin.Commands.DeleteSubscriptionPlan;

/// <summary>
/// Handler for <see cref="DeleteSubscriptionPlanCommand"/>.
/// </summary>
public class DeleteSubscriptionPlanCommandHandler : IRequestHandler<DeleteSubscriptionPlanCommand, ApiResponse<bool>>
{
    private readonly IGenericRepository<SubscriptionPlan> _planRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteSubscriptionPlanCommandHandler"/> class.
    /// </summary>
    public DeleteSubscriptionPlanCommandHandler(
        IGenericRepository<SubscriptionPlan> planRepository,
        IUnitOfWork unitOfWork)
    {
        _planRepository = planRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes deletion of a subscription plan.
    /// </summary>
    public async Task<ApiResponse<bool>> Handle(DeleteSubscriptionPlanCommand request, CancellationToken cancellationToken)
    {
        var plan = await _planRepository.GetByIdAsync(request.Id, cancellationToken);
        if (plan == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.SubscriptionPlanNotFound.GetDescription());
        }

        _planRepository.Remove(plan);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ApiResponse<bool>.Success(true, ResponseMessage.SubscriptionPlanDeleted.GetDescription());
    }
}
