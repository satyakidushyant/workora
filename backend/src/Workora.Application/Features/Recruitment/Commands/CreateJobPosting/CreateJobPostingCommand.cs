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
/// Command to create a new job vacancy opening.
/// </summary>
public record CreateJobPostingCommand(
    int CompanyId,
    int DepartmentId,
    string Title,
    string Description,
    string Requirements,
    EmploymentType EmploymentType,
    string Location,
    int ExperienceYearsMin,
    int ExperienceYearsMax,
    decimal? SalaryMin = null,
    decimal? SalaryMax = null,
    DateOnly? ClosingDate = null) : IRequest<ApiResponse<JobPostingDto>>;
