import { AiAssistantResponseDto } from '../dtos/workora-ai.dto';
import { AiAssistantResponse } from '../../domain/models/workora-ai.model';

export class WorkoraAiMapper {
  static fromResponseDto(dto: AiAssistantResponseDto): AiAssistantResponse {
    return {
      reply: dto.reply,
      intent: dto.intent,
      confidence: dto.confidence,
      suggestedActions: dto.suggestedActions || [],
      structuredData: dto.structuredData
    };
  }
}
