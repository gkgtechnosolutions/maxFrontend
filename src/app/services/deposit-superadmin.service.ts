import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { Operation } from '../domain/operation';
import { DepositTable } from '../domain/table';

@Injectable({
  providedIn: 'root'
})
export class DepositSuperadminService {

  constructor(private http : HttpClient, private config :AppConfigService ) { }
  baseUrl: String = this.config.getBaseurl();


  getDepositdata(): Observable<DepositTable[]> {
    return this.http.get<DepositTable[]>(
      `${this.baseUrl}/operation/superadmin/deposit/userCounts`
      
    )//subscribe to;
  }

  getDateDepositdata(startDate: string, endDate: string, pageSize: number , pageNumber: number): Observable<any> {
    
    let params = new HttpParams()
    .set('pageSize', pageSize.toString())
    .set('pageNumber', pageNumber.toString());
    
    
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/depositsbetweenDates/${startDate}/${endDate}`,{ params }
      
    )
  }

  getDateWithdrawdata(startDate: string, endDate: string, pageSize: number , pageNumber: number): Observable<any> {
    
    let params = new HttpParams()
    .set('pageSize', pageSize.toString())
    .set('pageNumber', pageNumber.toString());
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/withdrawsbetweenDates/${startDate}/${endDate}`,{ params } //changed here
      
    )
  }

  getAllDepositdata( pageSize: number , pageNumber: number): Observable<any> {
    
    let params = new HttpParams()
    .set('pageSize', pageSize.toString())
    .set('pageNumber', pageNumber.toString());
    
    
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/getAllDepositsPageable`,{ params }
      
    )
  }
  getAllWithdrawdata( pageSize: number , pageNumber: number): Observable<any> {
    
    let params = new HttpParams()
    .set('pageSize', pageSize.toString())
    .set('pageNumber', pageNumber.toString());
    
    
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/getAllWithdrawsPageable`,{ params }
      
    )
  }

  getTodaysAllDepositdata() : Observable<any>{
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/totalDepositDetailsForToday`
      
    )

  }
  getTodaysAllWithdrawdata(): Observable<any>{
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/totalWithdrawDetailsForToday`
      
    )

  }

  getTodaysDepositSuccessdata(): Observable<any>{
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/totalDepositDetailsForToday/success`
      
    )

  }

  getTodaysDepositFailuredata(): Observable<any>{
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/totalDepositDetailsForToday/failure`
      
    )

  }

  getTodaysWithdrawFailuredata(): Observable<any>{
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/totalWithdrawDetailsForToday/failure`
      
    )

  }

  getTodaysWithdrawSuccessdata(): Observable<any>{
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/totalWithdrawDetailsForToday/success`
      
    )

  }





}
