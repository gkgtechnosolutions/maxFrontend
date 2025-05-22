import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ChatMessageDTO, ConversationDTO, PagedResponse } from '../domain/ChatMessage';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WattiSimpleService {
  private baseUrl: string;
  
  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) {
    this.baseUrl = `${this.config.getBaseurl()}/api/chat`;
  }

  // Get all conversations
  getAllConversations(): Observable<ConversationDTO[]> {
    return this.http.get<ConversationDTO[]>(`${this.baseUrl}/conversations`);
  }

  // Get conversation by watiNumber
  getConversationByWatiNumber(watiNumber: string): Observable<ConversationDTO> {
    return this.http.get<ConversationDTO>(`${this.baseUrl}/conversations/${watiNumber}`);
  }

  // Get messages by watiNumber
  getMessagesByWatiNumber(watiNumber: string): Observable<ChatMessageDTO[]> {
    return this.http.get<ChatMessageDTO[]>(`${this.baseUrl}/messages/${watiNumber}`);
  }

  // Get paged messages by watiNumber
  getPagedMessagesByWatiNumber(
    watiNumber: string,
    page: number = 0,
    size: number = 20
  ): Observable<PagedResponse<ChatMessageDTO>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<PagedResponse<ChatMessageDTO>>(
      `${this.baseUrl}/messages/${watiNumber}/paged`, 
      { params }
    );
  }

  // Send text message
  sendMessage(message: ChatMessageDTO): Observable<ChatMessageDTO> {
    return this.http.post<ChatMessageDTO>(`${this.baseUrl}/messages`, message);
  }

  // Send message with media
  sendMessageWithMedia(
    watiNumber: string,
    content: string,
    isFromUser: boolean,
    media?: File
  ): Observable<ChatMessageDTO> {
    const formData = new FormData();
    formData.append('watiNumber', watiNumber);
    formData.append('content', content);
    formData.append('isFromUser', isFromUser.toString());
    
    if (media) {
      formData.append('media', media);
    }
    
    return this.http.post<ChatMessageDTO>(`${this.baseUrl}/messages/media`, formData);
  }

  // Get media file URL
  getFileUrl(fileName: string): string {
    return `${this.baseUrl}/files/${fileName}`;
  }
} 