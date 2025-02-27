import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { map, Observable, Subject } from 'rxjs';
import { AdminMessageRequest } from '../domain/chatbot';
import { webSocket } from 'rxjs/webSocket';
import { Client, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
 
  private stompClient: Client;
  private isConnected = false;
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();
  private subscription: StompSubscription | null = null;

  constructor(public http: HttpClient, private config: AppConfigService) {
   this.connect();
  }

  private transformChats(data: any): any[] {
    if (Array.isArray(data)) {
      return data.map(chat => ({
        name: chat.firstName || 'Unknown', // Use firstName as the name
        message: chat.lastMessage || '', // Use lastMessage as the chat message
        time: chat.lastMessageTime || new Date().toISOString(), // Use lastMessageTime or default to current time
        chatId: chat.chatId || `chat-${Math.random().toString(36).substr(2, 9)}` // Generate a default chatId if not present
      }));
    }
    return [];
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

  // getRecentChats(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/UBotProject/messages/recent`).pipe(
  //     map(chats => {
  //       // Transform the API response to match the structure expected by ChatComponent
  //       return chats.map(chat => ({
  //         name: chat.firstName, // Use firstName as the name
  //         message: chat.lastMessage, // Use lastMessage as the chat message
  //         time: chat.lastMessageTime,
  //         chatId:chat.chatId
  //       }));
  //     })
  //   );
  // }
  connect() {
    this.stompClient = new Client({
      brokerURL: 'ws://13.200.63.62:8080/ws', // Change this to your server URL
      reconnectDelay: 5000, // Auto-reconnect after 5 seconds
    });

    this.stompClient.onConnect = () => {
      this.isConnected = true;

      // Subscribe to topic
      this.subscription = this.stompClient.subscribe(
        '/topic/recentUsers',
        (message) => {
          const data = JSON.parse(message.body);

          this.messagesSubject.next(data);
        }
      );
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ STOMP Error:', frame);
      this.isConnected = false;
    };

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient && this.isConnected) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.stompClient.deactivate();
      console.log('❌ WebSocket Disconnected');
    }
  }

  // getRecentChats(): Observable<any[]> {
  //   return this.recentChatsSubject.asObservable();
  // }

  // private formatTime(timestamp: string): string {
  //   const date = new Date(timestamp);
  //   return date.toLocaleTimeString('en-US', {
  //     hour: 'numeric',
  //     minute: '2-digit',
  //     hour12: true
  //   });
  // }

}
