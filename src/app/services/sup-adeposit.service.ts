import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepositTable } from '../domain/table';

@Injectable({
  providedIn: 'root'
})
export class SupADepositService {

  constructor(public http: HttpClient, private config: AppConfigService) {}
  baseUrl: String = this.config.getBaseurl();


  getDepositCount(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/approveOperation/superAdmin/apDeposit/totalDoneApproveRequests`
    ); //subscribe to;
  }

  getDepositRequestCount(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/approveOperation/superAdmin/apDeposit/count`
    ); //subscribe to;
  }

  getDepositdata(): Observable<DepositTable[]> {
    return this.http.get<DepositTable[]>(
      `${this.baseUrl}/approveOperation/superAdmin/apDeposit/doneApproveRequests`
      
    )
  }


  getRecentDepositdata(): Observable<DepositTable[]> {
    return this.http.get<DepositTable[]>(
      `${this.baseUrl}/approveOperation/superAdmin/apDeposit/recentThree`
      
    )
  } 


  getRecentWithdrawdata(): Observable<DepositTable[]> {
    return this.http.get<DepositTable[]>(
      `${this.baseUrl}/approveOperation/superAdmin/apWithdraw/recentThree`
      
    )
  } 

  getTodaysDeposit(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/approveOperation/superAdmin/apDeposit/todaysADepositCount`
    );
  }

  getAllDepositdata( pageSize: number , pageNumber: number): Observable<any> {
    
    let params = new HttpParams()
    .set('pageSize', pageSize.toString())
    .set('pageNo', pageNumber.toString());
    
    
    return this.http.get<any>(
      `${this.baseUrl}/approveOperation/superAdmin/apDeposit/getPaginatedApproveDeposits`,{ params }
      
    )
  }


  getDateDepositdata(startDate: string, endDate: string, pageSize: number , pageNumber: number): Observable<any> {
    
    let params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('pageSize', pageSize.toString())
    .set('pageNo', pageNumber.toString());
    
    
    return this.http.get<any>(
      `${this.baseUrl}/approveOperation/superAdmin/apDeposit/byDateRange`,{ params }
      
    )
  }

  getWithdraw(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/approveOperation/superAdmin/apWithdraw/count`
    );
  }

  getAppvWithdraw(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/approveOperation/superAdmin/apWithdraw/totalDoneApproveRequests`
    );
  }



  getTodaysWithdraw(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/today/withdrawCount`
    );
  }

  getAllWithdrawdata( pageSize: number , pageNumber: number): Observable<any> {
    
    let params = new HttpParams()
    .set('pageSize', pageSize.toString())
    .set('pageNo', pageNumber.toString());
    
    
    return this.http.get<any>(
      `${this.baseUrl}/approveOperation/superAdmin/apWithdraw/getPaginatedApproveWithdraws`,{ params }
      
    )
  }

  getDateWithdrawdata(startDate: string, endDate: string, pageSize: number , pageNumber: number): Observable<any> {
    
    let params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('pageSize', pageSize.toString())
    .set('pageNo', pageNumber.toString());
    
    
    return this.http.get<any>(
      `${this.baseUrl}/approveOperation/superAdmin/apDeposit/byDateRange`,{ params }
      
    )
  

}

}
