export interface AiAssistantResponseDto {
  reply: string;
  intent: string;
  confidence: number;
  suggestedActions?: string[];
  structuredData?: any;
}

export interface AskWorkoraAiAssistantRequestDto {
  prompt: string;
  conversationContext?: string | null;
}
