using AutoMapper;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Queries.GetJobOfferById;

/// <summary>
/// Query to retrieve details of a specific job offer.
/// </summary>
public record GetJobOfferByIdQuery(int Id) : IRequest<ApiResponse<JobOfferDto>>;
