import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IWorkoraAiRepository } from '../../domain/repositories/i-workora-ai.repository';
import { AiAssistantResponse, AskAiAssistantParams } from '../../domain/models/workora-ai.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import { AiAssistantResponseDto, AskWorkoraAiAssistantRequestDto } from '../dtos/workora-ai.dto';
import { WorkoraAiMapper } from '../mappers/workora-ai.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkoraAiApiRepository implements IWorkoraAiRepository {
  private readonly baseUrl = `${environment.apiUrl}/ai`;

  constructor(private readonly http: HttpClient) {}

  ask(params: AskAiAssistantParams): Observable<AiAssistantResponse> {
    const payload: AskWorkoraAiAssistantRequestDto = {
      prompt: params.prompt,
      conversationContext: params.conversationContext || null
    };

    return this.http.post<ApiResponse<AiAssistantResponseDto>>(`${this.baseUrl}/ask`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'AI assistant request failed.');
        }
        return WorkoraAiMapper.fromResponseDto(response.data);
      })
    );
  }
}
