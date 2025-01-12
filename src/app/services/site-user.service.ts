import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { SiteUser } from '../domain/User';

@Injectable({
  providedIn: 'root'
})
export class SiteUserService {
  baseUrl: String = this.config.getBaseurl();
  private siteUSersSubject = new BehaviorSubject<SiteUser[]>([]);
  siteUsers$ = this.siteUSersSubject.asObservable();

  constructor(private http : HttpClient, private config :AppConfigService) {
   this.loadAllSiteUsers();
  }
  addSiteUser(siteUser:SiteUser ): Observable<any> {
    return this.http.post(`${this.baseUrl}/approveOperation/siteUserService/saveMastersUserToDb`, siteUser);
  }
  // deleteSiteUsers(siteUserID:number): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/approveOperation/siteUserService/toggleActiveStatus/${siteUserID}`);
   
  // }
  private loadAllSiteUsers(): void {
    this.http.get<any>(`${this.baseUrl}/approveOperation/siteUserService/getAllSiteUsers`)
      .pipe(
        tap((siteUsers: SiteUser[]) => this.siteUSersSubject.next(siteUsers))
      )
      .subscribe();
  }
  
  getAllSiteUserdata(pageSize:Number ,pageNo:Number): Observable<any> {
    let params = new HttpParams()
    .set('pageNo', pageNo.toString())
    .set('pageSize', pageSize.toString());
    
    return  this.http.get<SiteUser[]>(`${this.baseUrl}/approveOperation/siteUserService/getAllSiteUsers`,{ params })
  
    }
    getCountTotal(): Observable<any> {
      return this.http.get<any>(
        `${this.baseUrl}/approveOperation/siteservice/countSites`
      );
    } 

    updateSiteUser(SiteUser :SiteUser): Observable<any> {
      return this.http.put<any>(`${this.baseUrl}/approveOperation/siteUserService/updateSiteUsers`, SiteUser);
  
    }
    checkUser(username: String): Observable<any> {
      return this.http.get<any>(
        `${this.baseUrl}/approveOperation/siteUserService/checkUser/${username}`
      );
    }

}
