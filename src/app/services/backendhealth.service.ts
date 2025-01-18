import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
declare var appConfig;


@Injectable({
  providedIn: 'root'
})
export class BackendhealthService {
 
  constructor(private http: HttpClient ,private config :AppConfigService ) { }
  baseUrl: String = this.config.getBaseurl();
  secUrl: String = appConfig.secbackendUrl;

  checkHealth(): Observable<any> {
    // console.log(this.baseUrl);
    return this.http.get( `${this.baseUrl}/auth/BackendHealth` );
  }

  checkHealthSec(): Observable<any> {
    // console.log(this.baseUrl);
    return this.http.get( `${this.secUrl}/auth/BackendHealth` );
  }
}
