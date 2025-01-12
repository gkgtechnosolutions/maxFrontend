import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { Operation } from '../domain/operation';

@Injectable({
  providedIn: 'root'
})
export class RetryService {

  constructor(private http : HttpClient, private config :AppConfigService ) { }
  baseUrl: String = this.config.getBaseurl();

  postRetry(operation:Operation): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/operation/retry`,operation
    );
  }
  deleteReport(userID:number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/report/deleteReports/${userID}`
      ///report/todayDeposite/${userID}
    );
  }

}
