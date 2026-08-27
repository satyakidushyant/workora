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
