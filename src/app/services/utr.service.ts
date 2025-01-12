import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtrService {
  constructor(private config: AppConfigService, public http: HttpClient) {}
  baseUrl: String = this.config.getBaseurl();
  checkUtr(utr: String): Observable<any> {
    //'http://localhost:9096/operation/utr/check/{{utr}}
    return this.http.get<any>(`${this.baseUrl}/operation/utr/check/${utr}`);
  }

  getCheckUtr(utr: String): Observable<any> {
    let params = new HttpParams()
    .set('utrNumber', utr.toString())
    return this.http.get<any>(`${this.baseUrl}/operation/check-utr`, { params });
  }
}
