import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { USER } from '../domain/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {

  constructor( public http: HttpClient, private config:AppConfigService) { }
  baseUrl: String = this.config.getBaseurl();

  saveUser(user: USER): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/auth/save`,user
    );

  }
}
