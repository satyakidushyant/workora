using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.CreateJobPosting;

/// <summary>
/// Handler for <see cref="CreateJobPostingCommand"/>.
/// </summary>
public class CreateJobPostingCommandHandler : IRequestHandler<CreateJobPostingCommand, ApiResponse<JobPostingDto>>
{
    private readonly IRecruitmentRepository _recruitmentRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateJobPostingCommandHandler"/> class.
    /// </summary>
    public CreateJobPostingCommandHandler(
        IRecruitmentRepository recruitmentRepository,
        IDepartmentRepository departmentRepository,
        ICompanyRepository companyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _recruitmentRepository = recruitmentRepository;
        _departmentRepository = departmentRepository;
        _companyRepository = companyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<JobPostingDto>> Handle(CreateJobPostingCommand request, CancellationToken ct)
    {
        var company = await _companyRepository.GetByIdAsync(request.CompanyId, ct);
        if (company == null)
        {
            return ApiResponse<JobPostingDto>.Fail(ResponseMessage.CompanyNotFound.GetDescription());
        }

        var department = await _departmentRepository.GetByIdAsync(request.DepartmentId, ct);
        if (department == null)
        {
            return ApiResponse<JobPostingDto>.Fail(ResponseMessage.DepartmentNotFound.GetDescription());
        }

        var job = JobPosting.Create(
            request.CompanyId,
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

        await _recruitmentRepository.AddAsync(job, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var loaded = await _recruitmentRepository.GetJobWithDetailsAsync(job.Id, ct);
        var dto = _mapper.Map<JobPostingDto>(loaded ?? job);
        return ApiResponse<JobPostingDto>.Success(dto, ResponseMessage.JobPostingCreated.GetDescription());
    }
}
