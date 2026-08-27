using AutoMapper;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Queries.GetAppraisalById;

/// <summary>
/// Query to retrieve details of a specific appraisal review.
/// </summary>
public record GetAppraisalByIdQuery(int Id) : IRequest<ApiResponse<AppraisalDto>>;
