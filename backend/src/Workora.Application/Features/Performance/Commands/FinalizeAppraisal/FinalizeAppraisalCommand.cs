using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.FinalizeAppraisal;

/// <summary>
/// Command to finalize an appraisal review cycle with composite score.
/// </summary>
public record FinalizeAppraisalCommand(
    int Id,
    decimal FinalScore) : IRequest<ApiResponse<AppraisalDto>>;

/// <summary>
/// Validator for <see cref="FinalizeAppraisalCommand"/>.
/// </summary>
public class FinalizeAppraisalCommandValidator : AbstractValidator<FinalizeAppraisalCommand>
{
    /// <summary>
    /// Initializes validation rules for finalizing appraisal.
    /// </summary>
    public FinalizeAppraisalCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid appraisal ID is required.");
        RuleFor(x => x.FinalScore).InclusiveBetween(1m, 5m).WithMessage("Final score must be between 1 and 5.");
    }
}

/// <summary>
/// Handler for <see cref="FinalizeAppraisalCommand"/>.
/// </summary>
public class FinalizeAppraisalCommandHandler : IRequestHandler<FinalizeAppraisalCommand, ApiResponse<AppraisalDto>>
{
    private readonly IPerformanceRepository _performanceRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="FinalizeAppraisalCommandHandler"/> class.
    /// </summary>
    public FinalizeAppraisalCommandHandler(
        IPerformanceRepository performanceRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _performanceRepository = performanceRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AppraisalDto>> Handle(FinalizeAppraisalCommand request, CancellationToken ct)
    {
        var appraisal = await _performanceRepository.GetAppraisalWithDetailsAsync(request.Id, ct);
        if (appraisal == null)
        {
            return ApiResponse<AppraisalDto>.Fail(ResponseMessage.AppraisalNotFound.GetDescription());
        }

        appraisal.FinalizeAppraisal(request.FinalScore);
        _performanceRepository.Update(appraisal);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<AppraisalDto>(appraisal);
        return ApiResponse<AppraisalDto>.Success(dto, ResponseMessage.AppraisalFinalized.GetDescription());
    }
}
