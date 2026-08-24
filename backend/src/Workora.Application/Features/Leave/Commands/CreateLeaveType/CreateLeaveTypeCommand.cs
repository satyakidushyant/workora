using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.CreateLeaveType;

/// <summary>
/// Command to configure a new leave type.
/// </summary>
public record CreateLeaveTypeCommand(
    int CompanyId,
    string Name,
    string Code,
    decimal AnnualQuota,
    bool RequiresHrApproval,
    bool AllowNegativeBalance,
    string? Description) : IRequest<ApiResponse<LeaveTypeDto>>;

/// <summary>
/// Validator for <see cref="CreateLeaveTypeCommand"/>.
/// </summary>
public class CreateLeaveTypeCommandValidator : AbstractValidator<CreateLeaveTypeCommand>
{
    /// <summary>
    /// Initializes validation rules for creating a leave type.
    /// </summary>
    public CreateLeaveTypeCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100).WithMessage("Leave type name is required.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Leave type code is required.");
        RuleFor(x => x.AnnualQuota).GreaterThanOrEqualTo(0).WithMessage("Annual quota cannot be negative.");
    }
}

/// <summary>
/// Handler for <see cref="CreateLeaveTypeCommand"/>.
/// </summary>
public class CreateLeaveTypeCommandHandler : IRequestHandler<CreateLeaveTypeCommand, ApiResponse<LeaveTypeDto>>
{
    private readonly ILeaveRequestRepository _leaveRequestRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateLeaveTypeCommandHandler"/> class.
    /// </summary>
    public CreateLeaveTypeCommandHandler(
        ILeaveRequestRepository leaveRequestRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _leaveRequestRepository = leaveRequestRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<LeaveTypeDto>> Handle(CreateLeaveTypeCommand request, CancellationToken ct)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId, ct);
        if (company == null)
        {
            return ApiResponse<LeaveTypeDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var leaveType = LeaveType.Create(
            request.CompanyId,
            request.Name,
            request.Code,
            request.AnnualQuota,
            request.RequiresHrApproval,
            request.AllowNegativeBalance,
            request.Description);

        await _leaveRequestRepository.AddLeaveTypeAsync(leaveType, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<LeaveTypeDto>(leaveType);
        return ApiResponse<LeaveTypeDto>.Success(dto, ResponseMessage.LeaveTypeCreated.GetDescription());
    }
}
