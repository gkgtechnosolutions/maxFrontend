import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { Operation } from '../domain/operation';
import { DepositTable } from '../domain/table';


@Injectable({
  providedIn: 'root'
})
export class SearchsuperadminService {

  constructor(private http : HttpClient, private config :AppConfigService ) { }
  baseUrl: String = this.config.getBaseurl();

  getSearchRangeDepositdata(startDate: string, endDate: string, searchTerm: string, pageSize: number, pageNumber: number): Observable<any> {
    let params = new HttpParams()
    .set('searchTerm', searchTerm)
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('page', pageNumber.toString())
    .set('size', pageSize.toString());
   
     
      

    return this.http.get<any>(`${this.baseUrl}/operation/superadmin/deposits/search`, { params });
  }

  getSearchRangeWithdrawData(startDate: string, endDate: string, searchTerm: string, pageSize: number, pageNumber: number): Observable<any> {
    let params = new HttpParams()
      .set('size', pageSize.toString())
      .set('page', pageNumber.toString())
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('searchTerm', searchTerm);

    return this.http.get<any>(`${this.baseUrl}/operation/superadmin/withdraws/search`, { params });
  }

  getSearchAllDepositData( searchTerm: string, pageSize: number, pageNumber: number): Observable<any> {
    let params = new HttpParams()
    .set('searchTerm', searchTerm)
    .set('pageSize', pageSize.toString())
    .set('pageNumber', pageNumber.toString());
    return this.http.get<any>(`${this.baseUrl}/operation/superadmin/searchInTotalDeposits`, { params });
  }

  getSearchAllWithdrawData( searchTerm: string, pageSize: number, pageNumber: number): Observable<any> {
    let params = new HttpParams()
    .set('searchTerm', searchTerm)
    .set('pageSize', pageSize.toString())
    .set('pageNumber', pageNumber.toString());
    return this.http.get<any>(`${this.baseUrl}/operation/superadmin/searchInTotalWithdraws`, { params });
  }
  
  getTotalDepositAmount(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/operation/bank/totalDepositAmountForToday`);
  }
  getTotalWithdrawAmount(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/operation/bank/totalWithdrawAmountForToday`);
  }
}
