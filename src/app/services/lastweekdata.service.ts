import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastweekdataService {

  constructor(private http : HttpClient, private config :AppConfigService ) { }
  baseUrl: String = this.config.getBaseurl();
  getLastWeekDeposits(pageNumber: number, pageSize: number): Observable<any> {
    
    return  this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/lastWeekDeposits/${pageSize}/${pageNumber}`
      
    )
  }
  getLastWeekWithdraws(pageNumber: number, pageSize: number): Observable<any> {
    
    return  this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/lastWeekWithdraws/${pageSize}/${pageNumber}`
      
    )
  }
}
