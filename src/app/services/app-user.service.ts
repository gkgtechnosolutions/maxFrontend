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
  getDepositList (id:number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/approveOperation/superAdmin/apDeposit/doneListByExecutedBy/${id}`
    );
  }

  getWithdrawList (id:number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/approveOperation/superAdmin/apWithdraw/doneListByExecutedBy/${id}`
    );
  }

  getUserDetails(userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/auth/created-by/${userId}`
    );
  }

  getUserDetailsAsRole(userId: number ,role:string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/auth/created-by/${userId}/${role}`
    );
  }

  blockUser(userId: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/auth/blockUser/${userId}`,
      {}
    );
   
}
}
