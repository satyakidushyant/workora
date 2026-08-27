using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetCandidateById;

/// <summary>
/// Query to retrieve a candidate's complete profile with interview notes and offers.
/// </summary>
public record GetCandidateByIdQuery(int Id) : IRequest<ApiResponse<CandidateDetailDto>>;
