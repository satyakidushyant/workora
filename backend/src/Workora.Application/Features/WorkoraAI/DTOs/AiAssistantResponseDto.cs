namespace Workora.Application.Features.WorkoraAI.DTOs;

/// <summary>
/// Response payload returned by the Workora AI Assistant.
/// </summary>
public record AiAssistantResponseDto(
    string Reply,
    string Intent,
    double Confidence,
    List<string>? SuggestedActions,
    object? StructuredData);
