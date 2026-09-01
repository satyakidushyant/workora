using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Training.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Queries.GetTrainingProgramsList;

/// <summary>
/// Query to retrieve a paginated list of training programs with dynamic pagination and filtering.
/// </summary>
public record GetTrainingProgramsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<TrainingProgramDto>>>
{
    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }
}

