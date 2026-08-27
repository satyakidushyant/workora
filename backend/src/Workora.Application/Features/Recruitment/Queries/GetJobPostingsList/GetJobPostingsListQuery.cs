using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetJobPostingsList;

/// <summary>
/// Query to retrieve a paginated list of job postings with optional filters.
/// </summary>
public record GetJobPostingsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? CompanyId = null,
    int? DepartmentId = null,
    JobStatus? Status = null,
    string? SearchTerm = null) : IRequest<ApiResponse<PagedResponse<JobPostingDto>>>;
