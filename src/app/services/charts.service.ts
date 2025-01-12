import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  constructor(private http: HttpClient,private config :AppConfigService) { }
  baseUrl: String = this.config.getBaseurl();

  getDepositChartData(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/deposits/countLastFifteenDays`
      
    )
  }

  getWithdrawalChartData(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/withdraws/countLastFifteenDays`
      
    )
  }
}
