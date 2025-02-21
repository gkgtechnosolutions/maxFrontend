import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
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

}
