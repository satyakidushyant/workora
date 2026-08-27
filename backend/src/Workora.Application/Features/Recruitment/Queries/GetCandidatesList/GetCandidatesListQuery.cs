using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetCandidatesList;

/// <summary>
/// Query to retrieve a paginated and filtered list of candidate applicants.
/// </summary>
public record GetCandidatesListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? JobPostingId = null,
    CandidateStage? Stage = null,
    string? SearchTerm = null,
    int? CompanyId = null) : IRequest<ApiResponse<PagedResponse<CandidateDto>>>;
