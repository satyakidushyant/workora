using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.WorkoraAI.Commands.AskWorkoraAiAssistant;
using Workora.Application.Features.WorkoraAI.DTOs;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for the Workora Conversational AI Assistant.
/// </summary>
[ApiController]
[Route("api/v1/ai")]
public class WorkoraAiController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="WorkoraAiController"/> class.
    /// </summary>
    public WorkoraAiController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Sends a natural language prompt or query to the Workora AI Assistant.
    /// </summary>
    /// <param name="command">The user prompt and context module.</param>
    /// <returns>Assistant reply, intent, and actionable recommendations.</returns>
    [HttpPost("ask")]
    [Authorize]
    public async Task<ApiResponse<AiAssistantResponseDto>> AskAssistant([FromBody] AskWorkoraAiAssistantCommand command)
        => await _mediator.Send(command);
}
