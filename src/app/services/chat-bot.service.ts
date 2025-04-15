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
  // baseUrlws: string = this.config.getBaseurlws();

  getLastMessages(chatId: string, page: number = 0): Observable<any> {
     let params = new HttpParams()
       .set('page', page.toString())
     
       
       
       return this.http.get<any>(
         `${this.baseUrl}/UBotProject/messages/last/${chatId}`,{ params }
         
       )
  }
 
  // sendMessage(request: AdminMessageRequest): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/UBotProject/messages/send`, request);
  // }

  // sendMessage(
  //   adminId: number,
  //   chatId: string,
  //   text?: string,
  //   file?: File
  // ): Observable<any> {
  //   // Create FormData for multipart request
  //   const formData = new FormData();
    
  //   // Add required parameter
  //   formData.append('chatId', chatId);

  //   // Add optional parameters if they exist
  //   if (text) formData.append('text', text);
  //   if (file) formData.append('file', file);

  //   // Make the POST request
  //   return this.http.post<Map<string, string>>(
  //     `${this.baseUrl}/UBotProject/messages/send/${adminId}`,
  //     formData
  //   );
  // }

  sendMessage(
    adminId: number,
    chatId: string,
    texts?: string,  // Changed to string[] to match backend List<String>
    files?: File[]     // File[] to match backend MultipartFile[]
  ): Observable<Map<string, string>> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();

    // Add required parameters
    formData.append('chatId', chatId);

    formData.append('text', texts);
    // Add optional texts if provided
    // if (texts && texts.length > 0) {
    //   texts.forEach((text, index) => {
    //     formData.append(`texts[${index}]`, text); // Match backend List<String>
    //   });
    // }

    // Add optional files if provided
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append('file', file, file.name); // Match backend MultipartFile[]
      });
    }

    // Make the POST request
    return this.http.post<Map<string, string>>(
    `${this.baseUrl}/UBotProject/messages/send/${adminId}`,
      formData
    );
  }

  sendMessage2(
    adminId: number,
    chatId: string,
    texts?: string[],  // Still an array in the method signature
    files?: File[]     // File[] to match backend MultipartFile[]
  ): Observable<Map<string, string>> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
  
    // Add required parameters
    formData.append('chatId', chatId);
  
    // Add optional texts as individual "text" entries
    if (texts && texts.length > 0) {
      texts.forEach((text) => {
        formData.append('text', text); // Append each text as a separate "text" field
      });
    }
  
    // Add optional files if provided
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append('file', file, file.name);  // Keep files as an array
      });
    }
  
    // Make the POST request
    return this.http.post<Map<string, string>>(
      `${this.baseUrl}/UBotProject/messages/send/${adminId}`,
      formData
    );
  }
  // sendMessage(
  //   adminId: number,
  //   chatId: string,
  //   text?: string,
  //   files?: File[] // Changed from single File to File[] array
  // ): Observable<any> {
  //   // Create FormData for multipart request
  //   const formData = new FormData();
    
  //   // Add required parameter
  //   formData.append('chatId', chatId);

  //   // Add optional parameters if they exist
  //   if (text) {
  //     formData.append('text', text);
  //   }
  //   if (files && files.length > 0) {
  //     // Append each file to the FormData
  //     files.forEach((file, index) => {
  //       formData.append(`files[${index}]`, file, file.name);
  //     });
  //   }

  //   // Make the POST request
  //   return this.http.post<Map<string, string>>(
  //     `${this.baseUrl}/UBotProject/messages/send/${adminId}`,
  //     formData
  //   );
  // }
  

 
  connect() {
    this.stompClient = new Client({
      // brokerURL : this.baseUrl.replace('http://', 'ws://') + '/ws',
      brokerURL: 'ws://13.200.63.62:8080/ws', // Change this to your server URL #Important chanegs
      // brokerURL: 'wss://stop-organ-everything-listing.trycloudflare.com/ws', // Change this to your server URL #Important chanegs
      // brokerURL : this.baseUrlws ,
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



}
