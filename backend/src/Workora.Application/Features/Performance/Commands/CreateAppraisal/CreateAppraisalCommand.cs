using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.CreateAppraisal;

/// <summary>
/// Command to initiate an appraisal review cycle for an employee.
/// </summary>
public record CreateAppraisalCommand(
    int EmployeeId,
    int ReviewerEmployeeId,
    string Period,
    int Year) : IRequest<ApiResponse<AppraisalDto>>;

/// <summary>
/// Validator for <see cref="CreateAppraisalCommand"/>.
/// </summary>
public class CreateAppraisalCommandValidator : AbstractValidator<CreateAppraisalCommand>
{
    /// <summary>
    /// Initializes validation rules for appraisal initiation.
    /// </summary>
    public CreateAppraisalCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.ReviewerEmployeeId).GreaterThan(0).WithMessage("Valid reviewer ID is required.");
        RuleFor(x => x.Period).NotEmpty().MaximumLength(100).WithMessage("Review period is required.");
        RuleFor(x => x.Year).GreaterThanOrEqualTo(2020).WithMessage("Valid year is required.");
    }
}

/// <summary>
/// Handler for <see cref="CreateAppraisalCommand"/>.
/// </summary>
public class CreateAppraisalCommandHandler : IRequestHandler<CreateAppraisalCommand, ApiResponse<AppraisalDto>>
{
    private readonly IPerformanceRepository _performanceRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateAppraisalCommandHandler"/> class.
    /// </summary>
    public CreateAppraisalCommandHandler(
        IPerformanceRepository performanceRepository,
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _performanceRepository = performanceRepository;
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AppraisalDto>> Handle(CreateAppraisalCommand request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<AppraisalDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var reviewer = await _employeeRepository.GetByIdAsync(request.ReviewerEmployeeId, ct);
        if (reviewer == null)
        {
            return ApiResponse<AppraisalDto>.Fail(ResponseMessage.EmployeeNotFound.GetDescription());
        }

        var appraisal = Appraisal.Create(
            request.EmployeeId,
            request.ReviewerEmployeeId,
            request.Period,
            request.Year);

        await _performanceRepository.AddAsync(appraisal, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var loaded = await _performanceRepository.GetAppraisalWithDetailsAsync(appraisal.Id, ct);
        var dto = _mapper.Map<AppraisalDto>(loaded ?? appraisal);
        return ApiResponse<AppraisalDto>.Success(dto, ResponseMessage.AppraisalCreated.GetDescription());
    }
}
