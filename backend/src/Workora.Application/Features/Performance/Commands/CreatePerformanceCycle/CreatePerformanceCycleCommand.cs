using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.CreatePerformanceCycle;

/// <summary>
/// Command to create a performance appraisal review cycle.
/// </summary>
public record CreatePerformanceCycleCommand(
    int CompanyId,
    string Title,
    int Year) : IRequest<ApiResponse<PerformanceCycleDto>>;
