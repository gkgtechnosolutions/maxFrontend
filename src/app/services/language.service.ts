import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private http : HttpClient, private config :AppConfigService) {}
  baseUrl: String = this.config.getBaseurl();

  getLanguage(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/UBotProject/languages`);
  }
  addLanguage(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/UBotProject/languages`, data);
  }

  updateLanguage(data:any): Observable<any> {
      return this.http.put<any>(`${this.baseUrl}/UBotProject/languages/${data.id}`, data);
    }
   
   getReplybyLanguage(data:any): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/UBotProject/replies/by-language/${data}`);
    } 

    updateReplyMessage(id: number, languageId: number, message: string): Observable<any> {
      const url = `${this.baseUrl}/UBotProject/replies/${id}/language/${languageId}`;
      
      return this.http.patch(url, message);
    } 
    searchReply(search: string): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/UBotProject/replies/search`, { params: { searchText: search } });
    }

}
