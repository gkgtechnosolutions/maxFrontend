import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
      `${this.baseUrl}/approveOperation/superAdmin/apWithdraw/todaysApprovedCount`
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





getTodaysDepositSuccessdata(): Observable<any>{

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  return this.http.get<any>(
    `${this.baseUrl}/approveOperation/superAdmin/apDeposit/todaySuccessfulExcel`
    , {
      headers: headers,
      responseType: 'blob' as 'json'
    }
    
  )

}

getTodaysDepositFailuredata(): Observable<any>{
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  return this.http.get<any>(
    `${this.baseUrl}/approveOperation/superAdmin/apDeposit/todayFailedExcel`
    , {
      headers: headers,
      responseType: 'blob' as 'json'
    }
    
  )

}

getTodaysWithdrawFailuredata(): Observable<any>{
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  return this.http.get<any>(
    `${this.baseUrl}/approveOperation/superAdmin/apWithdraw/todayFailedExcel`
    , {
      headers: headers,
      responseType: 'blob' as 'json'
    }
    
  )

}

getTodaysWithdrawSuccessdata(): Observable<any>{
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  return this.http.get<any>(
    `${this.baseUrl}/approveOperation/superAdmin/apWithdraw/todaySuccessfulExcel`
    , {
      headers: headers,
      responseType: 'blob' as 'json'
    }
    
  )

}

DownExcelDepodateRange( startDate: number , endDate: number): Observable<any> {
  
  let params = new HttpParams()
  .set('startDate', startDate.toString())
  .set('endDate', endDate.toString());

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  
  
  return this.http.get<any>(
    `${this.baseUrl}/approveOperation/superAdmin/apDeposit/byDateRangExcel`,
    { 
      params , 
      headers: headers,
      responseType: 'blob' as 'json' 
   }
  
    
  )
}

DownExcelWithdateRange( startDate: number , endDate: number): Observable<any> {
  
  let params = new HttpParams()
  .set('startDate', startDate.toString())
  .set('endDate', endDate.toString());

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  
  
  return this.http.get<any>(
    `${this.baseUrl}/approveOperation/superAdmin/apWithdraw/byDateRangExcel`,
    { 
      params , 
      headers: headers,
      responseType: 'blob' as 'json' 
   }
  
    
  )
}

}
