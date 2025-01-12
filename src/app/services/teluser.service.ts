import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeluserService {


  constructor(public http: HttpClient, private config: AppConfigService) {
    

  }
  baseUrl: String = this.config.getBaseurl();

  getTelUserData( pageSize:number, pageNo:number): Observable<any>{
    const params =  new HttpParams()
     
    .set('pageSize', pageSize.toString())
    .set('pageNo', pageNo.toString());

    return this.http.get<any>(`${this.baseUrl}/messageHandler/bUser/all`,{params});



  }

  getClientById(Id: number) {
    return this.http.get<any>(`${this.baseUrl}/messageHandler/clientusers/buser/${Id}`);
  }

  deleteClent(clientId:number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/messageHandler/clientusers/unlinkBUser/${clientId}`);
   
  } 

  searchBotUser(clientId): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/messageHandler/clientusers/connectedBUser/${clientId}`);
  }
  
  sendFormData(formData: FormData): Observable<any> {
    return this.http.post( 'http://your-backend-api.com/send-message', formData);
  }
}
