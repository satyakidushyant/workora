using AutoMapper;
using MediatR;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Queries.GetTrainingProgramsList;

/// <summary>
/// Query to retrieve a paginated list of training programs.
/// </summary>
public record GetTrainingProgramsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? CompanyId = null) : IRequest<ApiResponse<PagedResponse<TrainingProgramDto>>>;
