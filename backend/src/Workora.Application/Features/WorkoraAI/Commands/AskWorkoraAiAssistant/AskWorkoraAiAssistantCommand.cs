using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.WorkoraAI.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.WorkoraAI.Commands.AskWorkoraAiAssistant;

/// <summary>
/// Command to ask a natural language question or action request to Workora AI.
/// </summary>
public record AskWorkoraAiAssistantCommand(string Prompt, string? ContextModule) : IRequest<ApiResponse<AiAssistantResponseDto>>;
