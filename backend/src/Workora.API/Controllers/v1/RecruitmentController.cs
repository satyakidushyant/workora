using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Recruitment.Commands.AcceptJobOffer;
using Workora.Application.Features.Recruitment.Commands.CloseJobPosting;
using Workora.Application.Features.Recruitment.Commands.CreateCandidate;
using Workora.Application.Features.Recruitment.Commands.CreateJobOffer;
using Workora.Application.Features.Recruitment.Commands.CreateJobPosting;
using Workora.Application.Features.Recruitment.Commands.DeclineJobOffer;
using Workora.Application.Features.Recruitment.Commands.MoveCandidateStage;
using Workora.Application.Features.Recruitment.Commands.PublishJobPosting;
using Workora.Application.Features.Recruitment.Commands.RejectCandidate;
using Workora.Application.Features.Recruitment.Commands.ScheduleInterview;
using Workora.Application.Features.Recruitment.Commands.SendJobOffer;
using Workora.Application.Features.Recruitment.Commands.SubmitInterviewFeedback;
using Workora.Application.Features.Recruitment.Commands.UpdateJobPosting;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Application.Features.Recruitment.Queries.GetCandidateById;
using Workora.Application.Features.Recruitment.Queries.GetCandidatesList;
using Workora.Application.Features.Recruitment.Queries.GetInterviewsList;
using Workora.Application.Features.Recruitment.Queries.GetJobOfferById;
using Workora.Application.Features.Recruitment.Queries.GetJobPostingById;
using Workora.Application.Features.Recruitment.Queries.GetJobPostingsList;
using Workora.Application.Features.Recruitment.Queries.GetRecruitmentPipeline;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

using Workora.Application.Features.Recruitment.Queries.GetOfferLetterPdf;
using Workora.Application.Features.Recruitment.Commands.ResendOfferLetter;
namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for job vacancy postings, applicant candidate pipeline, interview scheduling, and job offers.
/// </summary>
[ApiController]
[Route("api/v1/recruitment")]
public class RecruitmentController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="RecruitmentController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public RecruitmentController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a paginated list of job vacancies.
    /// </summary>
    /// <param name="query">Filtering criteria.</param>
    /// <returns>A paginated list of job vacancies.</returns>
    [HttpGet("jobs")]
    [Authorize(Policy = "recruitment.view")]
    public async Task<ApiResponse<PagedResponse<JobPostingDto>>> GetJobs([FromQuery] GetJobPostingsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets details for a single job vacancy.
    /// </summary>
    /// <param name="id">The job posting ID.</param>
    /// <returns>The job details.</returns>
    [HttpGet("jobs/{id:int}")]
    [Authorize(Policy = "recruitment.view")]
    public async Task<ApiResponse<JobPostingDto>> GetJobById(int id)
        => await _mediator.Send(new GetJobPostingByIdQuery(id));

    /// <summary>
    /// Creates a new job vacancy opening.
    /// </summary>
    /// <param name="command">The creation command payload.</param>
    /// <returns>The newly created job opening.</returns>
    [HttpPost("jobs")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<JobPostingDto>> CreateJob([FromBody] CreateJobPostingCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Updates an existing job vacancy opening.
    /// </summary>
    /// <param name="id">The job posting ID.</param>
    /// <param name="command">The update command payload.</param>
    /// <returns>The updated job opening.</returns>
    [HttpPut("jobs/{id:int}")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<JobPostingDto>> UpdateJob(int id, [FromBody] UpdateJobPostingCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Publishes a job vacancy opening.
    /// </summary>
    /// <param name="id">The job posting ID.</param>
    /// <returns>The updated job opening.</returns>
    [HttpPatch("jobs/{id:int}/publish")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<JobPostingDto>> PublishJob(int id)
        => await _mediator.Send(new PublishJobPostingCommand(id));

    /// <summary>
    /// Closes a job vacancy opening.
    /// </summary>
    /// <param name="id">The job posting ID.</param>
    /// <returns>The updated job opening.</returns>
    [HttpPatch("jobs/{id:int}/close")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<JobPostingDto>> CloseJob(int id)
        => await _mediator.Send(new CloseJobPostingCommand(id));

    /// <summary>
    /// Submits a candidate application for a job vacancy.
    /// </summary>
    /// <param name="command">The candidate application command payload.</param>
    /// <returns>The created candidate profile.</returns>
    [HttpPost("candidates")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<CandidateDto>> CreateCandidate([FromBody] CreateCandidateCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Gets a paginated list of candidate applicants.
    /// </summary>
    /// <param name="query">Filter parameters.</param>
    /// <returns>A paginated list of candidates.</returns>
    [HttpGet("candidates")]
    [Authorize(Policy = "recruitment.view")]
    public async Task<ApiResponse<PagedResponse<CandidateDto>>> GetCandidates([FromQuery] GetCandidatesListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets full details for a candidate profile.
    /// </summary>
    /// <param name="id">The candidate ID.</param>
    /// <returns>The candidate profile with interviews and offers.</returns>
    [HttpGet("candidates/{id:int}")]
    [Authorize(Policy = "recruitment.view")]
    public async Task<ApiResponse<CandidateDetailDto>> GetCandidateById(int id)
        => await _mediator.Send(new GetCandidateByIdQuery(id));

    /// <summary>
    /// Moves a candidate to a new recruitment pipeline stage.
    /// </summary>
    /// <param name="id">The candidate ID.</param>
    /// <param name="command">The stage movement command payload.</param>
    /// <returns>The updated candidate.</returns>
    [HttpPatch("candidates/{id:int}/stage")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<CandidateDto>> MoveCandidateStage(int id, [FromBody] MoveCandidateStageCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Disqualifies / rejects a candidate applicant.
    /// </summary>
    /// <param name="id">The candidate ID.</param>
    /// <param name="command">Rejection command payload.</param>
    /// <returns>The updated candidate.</returns>
    [HttpPatch("candidates/{id:int}/reject")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<CandidateDto>> RejectCandidate(int id, [FromBody] RejectCandidateCommand? command)
        => await _mediator.Send((command ?? new RejectCandidateCommand(id, null)) with { Id = id });

    /// <summary>
    /// Schedules an interview with a candidate.
    /// </summary>
    /// <param name="command">Interview schedule command payload.</param>
    /// <returns>The scheduled interview.</returns>
    [HttpPost("interviews")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<InterviewDto>> ScheduleInterview([FromBody] ScheduleInterviewCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Gets a list of scheduled interviews.
    /// </summary>
    /// <param name="interviewerId">Optional interviewer ID filter.</param>
    /// <param name="candidateId">Optional candidate ID filter.</param>
    /// <param name="status">Optional status filter.</param>
    /// <returns>A list of interviews.</returns>
    [HttpGet("interviews")]
    [Authorize(Policy = "recruitment.view")]
    public async Task<ApiResponse<IReadOnlyList<InterviewDto>>> GetInterviews(
        [FromQuery] int? interviewerId = null,
        [FromQuery] int? candidateId = null,
        [FromQuery] InterviewStatus? status = null)
        => await _mediator.Send(new GetInterviewsListQuery(interviewerId, candidateId, status));

    /// <summary>
    /// Submits qualitative feedback and rating score for an interview.
    /// </summary>
    /// <param name="id">The interview ID.</param>
    /// <param name="command">The feedback command payload.</param>
    /// <returns>The updated interview.</returns>
    [HttpPost("interviews/{id:int}/feedback")]
    [Authorize(Policy = "recruitment.interview")]
    public async Task<ApiResponse<InterviewDto>> SubmitInterviewFeedback(int id, [FromBody] SubmitInterviewFeedbackCommand command)
        => await _mediator.Send(command with { Id = id });

    /// <summary>
    /// Generates a formal job offer for a candidate.
    /// </summary>
    /// <param name="command">The offer command payload.</param>
    /// <returns>The generated job offer.</returns>
    [HttpPost("offers")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<JobOfferDto>> CreateOffer([FromBody] CreateJobOfferCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Gets details of a specific job offer.
    /// </summary>
    /// <param name="id">The offer ID.</param>
    /// <returns>The job offer details.</returns>
    [HttpGet("offers/{id:int}")]
    [Authorize(Policy = "recruitment.view")]
    public async Task<ApiResponse<JobOfferDto>> GetOfferById(int id)
        => await _mediator.Send(new GetJobOfferByIdQuery(id));

    /// <summary>
    /// Formally sends a job offer to a candidate.
    /// </summary>
    /// <param name="id">The offer ID.</param>
    /// <returns>The updated offer.</returns>
    [HttpPatch("offers/{id:int}/send")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<JobOfferDto>> SendOffer(int id)
        => await _mediator.Send(new SendJobOfferCommand(id));

    /// <summary>
    /// Registers candidate acceptance of a job offer.
    /// </summary>
    /// <param name="id">The offer ID.</param>
    /// <returns>The updated offer.</returns>
    [HttpPatch("offers/{id:int}/accept")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<JobOfferDto>> AcceptOffer(int id)
        => await _mediator.Send(new AcceptJobOfferCommand(id));

    /// <summary>
    /// Registers candidate refusal of a job offer.
    /// </summary>
    /// <param name="id">The offer ID.</param>
    /// <returns>The updated offer.</returns>
    [HttpPatch("offers/{id:int}/decline")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<JobOfferDto>> DeclineOffer(int id)
        => await _mediator.Send(new DeclineJobOfferCommand(id));

    /// <summary>
    /// Downloads an offer letter PDF document.
    /// </summary>
    /// <param name="id">The offer ID.</param>
    /// <returns>Offer letter PDF details.</returns>
    [HttpGet("offers/{id:int}/pdf")]
    [Authorize(Policy = "recruitment.view")]
    public async Task<ApiResponse<OfferLetterPdfDto>> GetOfferPdf(int id)
        => await _mediator.Send(new GetOfferLetterPdfQuery(id));

    /// <summary>
    /// Resends job offer notification email to a candidate.
    /// </summary>
    /// <param name="id">The offer ID.</param>
    /// <returns>A confirmation boolean.</returns>
    [HttpPost("offers/{id:int}/resend")]
    [Authorize(Policy = "recruitment.manage")]
    public async Task<ApiResponse<bool>> ResendOffer(int id)
        => await _mediator.Send(new ResendOfferLetterCommand(id));

    /// <summary>
    /// Gets recruitment pipeline funnel metrics by candidate stage.
    /// </summary>
    /// <param name="jobPostingId">Optional job filter.</param>
    /// <param name="companyId">Optional company filter.</param>
    /// <returns>Pipeline statistics.</returns>
    [HttpGet("pipeline")]
    [Authorize(Policy = "recruitment.view")]
    public async Task<ApiResponse<RecruitmentPipelineDto>> GetPipeline(
        [FromQuery] int? jobPostingId = null,
        [FromQuery] int? companyId = null)
        => await _mediator.Send(new GetRecruitmentPipelineQuery(jobPostingId, companyId));
}
