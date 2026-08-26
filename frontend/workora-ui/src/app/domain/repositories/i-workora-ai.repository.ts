import { Observable } from 'rxjs';
import { AiAssistantResponse, AskAiAssistantParams } from '../models/workora-ai.model';

export interface IWorkoraAiRepository {
  ask(params: AskAiAssistantParams): Observable<AiAssistantResponse>;
}
