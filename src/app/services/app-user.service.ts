import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

constructor(public http: HttpClient, private config: AppConfigService) {}
  baseUrl: String = this.config.getBaseurl();

  getUserDetails(userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/auth/created-by/${userId}`
    );
  }
}
