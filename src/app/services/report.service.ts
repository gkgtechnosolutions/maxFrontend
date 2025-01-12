import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient, private config: AppConfigService) {}
  baseUrl: String = this.config.getBaseurl();

  getDepositeReport(userID: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/report/todayDeposite/${userID}`);
  }
  getWithdrawReport(userID: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/report/todayWithdraw/${userID}`);
  }
  //http://localhost:8089/report/todayAdduser/
  getAddNewReport(userID: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/report/todayAdduser/${userID}`);
  }
  getUpdateReport(userID: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/report/todayUpdatePassReport/${userID}`
    );
  }

  getAllReport(userID: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/report/totalReport/${userID}`);
  }
}
