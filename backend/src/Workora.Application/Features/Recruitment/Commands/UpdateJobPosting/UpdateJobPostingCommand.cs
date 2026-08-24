using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.UpdateJobPosting;

/// <summary>
/// Command to update an existing job posting.
/// </summary>
public record UpdateJobPostingCommand(
    int Id,
    int DepartmentId,
    string Title,
    string Description,
    string Requirements,
    EmploymentType EmploymentType,
    string Location,
    int ExperienceYearsMin,
    int ExperienceYearsMax,
    decimal? SalaryMin,
    decimal? SalaryMax,
    DateOnly? ClosingDate) : IRequest<ApiResponse<JobPostingDto>>;

/// <summary>
/// Validator for <see cref="UpdateJobPostingCommand"/>.
/// </summary>
public class UpdateJobPostingCommandValidator : AbstractValidator<UpdateJobPostingCommand>
{
    /// <summary>
    /// Initializes validation rules for updating a job posting.
    /// </summary>
    public UpdateJobPostingCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid job posting ID is required.");
        RuleFor(x => x.DepartmentId).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Job title is required.");
    }
}

/// <summary>
/// Handler for <see cref="UpdateJobPostingCommand"/>.
/// </summary>
public class UpdateJobPostingCommandHandler : IRequestHandler<UpdateJobPostingCommand, ApiResponse<JobPostingDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateJobPostingCommandHandler"/> class.
    /// </summary>
    public UpdateJobPostingCommandHandler(
        IRecruitmentRepository recruitmentRepository,
        IDepartmentRepository departmentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _departmentRepository = departmentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<JobPostingDto>> Handle(UpdateJobPostingCommand request, CancellationToken ct)
    {
        var job = await _recruitmentRepository.GetJobWithDetailsAsync(request.Id, ct);
        if (job == null)
        {
            return ApiResponse<JobPostingDto>.Fail(ResponseMessage.JobPostingNotFound.GetDescription());
        }

        var department = await _departmentRepository.GetByIdAsync(request.DepartmentId, ct);
        if (department == null)
        {
            return ApiResponse<JobPostingDto>.Fail(ResponseMessage.DepartmentNotFound.GetDescription());
        }

        job.Update(
            request.DepartmentId,
            request.Title,
            request.Description,
            request.Requirements,
            request.EmploymentType,
            request.Location,
            request.ExperienceYearsMin,
            request.ExperienceYearsMax,
            request.SalaryMin,
            request.SalaryMax,
            request.ClosingDate);

        _recruitmentRepository.Update(job);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = _mapper.Map<JobPostingDto>(job);
        return ApiResponse<JobPostingDto>.Success(dto, ResponseMessage.JobPostingUpdated.GetDescription());
    }
}
