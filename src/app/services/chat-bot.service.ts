import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { map, Observable } from 'rxjs';
import { AdminMessageRequest } from '../domain/chatbot';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {

  constructor(public http: HttpClient, private config: AppConfigService) {
  
  }
  baseUrl: String = this.config.getBaseurl();

  getLastMessages(chatId: string, page: number = 0): Observable<any> {
     let params = new HttpParams()
       .set('page', page.toString())
     
       
       
       return this.http.get<any>(
         `${this.baseUrl}/UBotProject/messages/last/${chatId}`,{ params }
         
       )
  }
 
  sendMessage(request: AdminMessageRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/UBotProject/messages/send`, request);
  }

  getRecentChats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/UBotProject/messages/recent`).pipe(
      map(chats => {
        // Transform the API response to match the structure expected by ChatComponent
        return chats.map(chat => ({
          name: chat.firstName, // Use firstName as the name
          message: chat.lastMessage, // Use lastMessage as the chat message
          time: chat.lastMessageTime,
          chatId:chat.chatId
        }));
      })
    );
  }

  // private formatTime(timestamp: string): string {
  //   const date = new Date(timestamp);
  //   return date.toLocaleTimeString('en-US', {
  //     hour: 'numeric',
  //     minute: '2-digit',
  //     hour12: true
  //   });
  // }

}
