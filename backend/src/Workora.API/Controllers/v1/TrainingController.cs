using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Training.Commands.CompleteTrainingEnrollment;
using Workora.Application.Features.Training.Commands.CreateTrainingProgram;
using Workora.Application.Features.Training.Commands.EnrollInTraining;
using Workora.Application.Features.Training.DTOs;
using Workora.Application.Features.Training.Queries.GetTrainingProgramById;
using Workora.Application.Features.Training.Queries.GetTrainingProgramsList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for employee learning and professional development training programs.
/// </summary>
[ApiController]
[Route("api/v1/training")]
public class TrainingController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="TrainingController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public TrainingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a paginated list of training programs.
    /// </summary>
    /// <param name="query">Pagination and company filter.</param>
    /// <returns>A paginated list of programs.</returns>
    [HttpGet("programs")]
    [Authorize(Policy = "training.view")]
    public async Task<ApiResponse<PagedResponse<TrainingProgramDto>>> GetPrograms([FromQuery] GetTrainingProgramsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets details of a specific training program.
    /// </summary>
    /// <param name="id">The program ID.</param>
    /// <returns>The training program details.</returns>
    [HttpGet("programs/{id:int}")]
    [Authorize(Policy = "training.view")]
    public async Task<ApiResponse<TrainingProgramDto>> GetProgramById(int id)
        => await _mediator.Send(new GetTrainingProgramByIdQuery(id));

    /// <summary>
    /// Creates a new corporate training course.
    /// </summary>
    /// <param name="command">The creation command payload.</param>
    /// <returns>The created program.</returns>
    [HttpPost("programs")]
    [Authorize(Policy = "training.manage")]
    public async Task<ApiResponse<TrainingProgramDto>> CreateProgram([FromBody] CreateTrainingProgramCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Enrolls an employee in a training program.
    /// </summary>
    /// <param name="command">The enrollment command payload.</param>
    /// <returns>The enrollment confirmation.</returns>
    [HttpPost("enroll")]
    [Authorize(Policy = "training.manage")]
    public async Task<ApiResponse<TrainingEnrollmentDto>> Enroll([FromBody] EnrollInTrainingCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Marks an employee's training program as completed.
    /// </summary>
    /// <param name="id">The enrollment ID.</param>
    /// <returns>The updated enrollment record.</returns>
    [HttpPatch("enrollments/{id:int}/complete")]
    [Authorize(Policy = "training.manage")]
    public async Task<ApiResponse<TrainingEnrollmentDto>> CompleteEnrollment(int id)
        => await _mediator.Send(new CompleteTrainingEnrollmentCommand(id));
}
