using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetJobPostingById;

/// <summary>
/// Query to retrieve details of a specific job posting.
/// </summary>
public record GetJobPostingByIdQuery(int Id) : IRequest<ApiResponse<JobPostingDto>>;
