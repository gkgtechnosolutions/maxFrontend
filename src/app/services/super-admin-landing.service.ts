import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminLandingService {
  constructor(public http: HttpClient, private config: AppConfigService) {}
  baseUrl: String = this.config.getBaseurl();
  totaldeposite: number;

  // getDeposite(): number {
  //     this.http.get<any>(
  //       `${this.baseUrl}/operation/superadmin/getdeposite`).subscribe(Response)=>{
  //         this.totaldeposite=Response.data;
  //       }

  //     //subscribe to;

  //     return this.totaldeposite;
  //   }
  private depositSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  public deposit$: Observable<number> = this.depositSubject.asObservable();
  private previousDeposit: number = 0;

  fetchDeposits(): void {
    this.http
      .get<any>(`${this.baseUrl}/operation/superadmin/getdeposite`)
      .subscribe((deposits) => {
        this.previousDeposit = this.depositSubject.value;
        this.depositSubject.next(deposits);
      });
  }
  getPreviousDeposit(): number {
    return this.previousDeposit;
  }

  getDeposite(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/getdeposite`
    ); //subscribe to;
  }

  getWithdraw(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/getwithdraw`
    );
  }

  getUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/operation/superadmin/getUsers`);
  }
  //http://localhost:9096/operation/superadmin/getAllUsers
  getAllUsers(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/getAllUsers`
    );
  }

  getTodaysDeposit(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/today/depositCount`
    );
  }

  getTodaysWithdraw(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/operation/superadmin/today/withdrawCount`
    );
  }




  getTodaysClient(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/operation/mastersUser/count-today-new-users`
    );
  }

}
