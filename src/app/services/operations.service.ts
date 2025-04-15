import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Deposite, DepositeWithdraw } from '../domain/Deposite';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { SiteUser } from '../domain/User';

@Injectable({
  providedIn: 'root',
})
export class OperationsService {
  constructor(public http: HttpClient, private config: AppConfigService) {}
  baseUrl: String = this.config.getBaseurl();

  // Method to handle deposit requests sequentially
  deposite(deposite: DepositeWithdraw): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/operation/deposite`, deposite);
  }




  // Additional methods for your service...

  getAllDeposite(page: number): Observable<Deposite[]> {
    return this.http.get<Deposite[]>(
      `${this.baseUrl}/operation/deposite/getDeposites/${page}`
    );
  }

  withdraw(withdraw: DepositeWithdraw): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/operation/withdraw`, withdraw);
  }

  updatePassword(siteUser: SiteUser): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/operation/updatePassword`,
      siteUser
    );
  }

  checkUser(username: String): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/operation/mastersUser/checkUser/${username}`
    );
  }

  addUser(siteUser: SiteUser): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/operation/add`, siteUser);
  }

  
  addUserToDatabase(siteUser: SiteUser): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/operation/mastersUser/saveMastersUsertodB`, siteUser);
  }


  findUser(username: String): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/operation/mastersUser/findUser/${username}`
    );
  }

  withdrawConfirmation(withdrawId: any,bankId:any): Observable<any> {
    let params = new HttpParams()
   .set('withdrawId', withdrawId.toString())
   .set('bankId', bankId.toString());
   return this.http.put<any>(`${this.baseUrl}/operation/add-bank`,{},{params} );
 }

}
