export interface AiAssistantResponse {
  reply: string;
  intent: string;
  confidence: number;
  suggestedActions?: string[];
  structuredData?: any;
}

export interface AskAiAssistantParams {
  prompt: string;
  conversationContext?: string | null;
}
