import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { USER } from '../domain/User';
import { SITE } from '../domain/Site';
import { SiteMaster } from '../domain/SiteMaster';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
 
  baseUrl: String = this.config.getBaseurl();
  private sitesSubject = new BehaviorSubject<SITE[]>([]);
  sites$ = this.sitesSubject.asObservable();

  constructor(private http : HttpClient, private config :AppConfigService) {
   this.loadAllSites();
  }
  addSite(site: { name: string, url: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/approveOperation/siteservice/addSite`, site);
  }
  deleteSite(SiteID:number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/approveOperation/siteservice/deleteSite/${SiteID}`);
   
  }
  private loadAllSites(): void {
    this.http.get<SITE[]>(`${this.baseUrl}/approveOperation/siteservice/getAllSites`)
      .pipe(
        tap((sites: SITE[]) => this.sitesSubject.next(sites))
      )
      .subscribe();
  }
  
  getAllSitedata(): Observable<SITE[]> {
    return this.sites$;
       
  
    }
    getCountTotal(): Observable<any> {
      return this.http.get<any>(
        `${this.baseUrl}/approveOperation/siteservice/countSites`
      );
    } 

    updateSite(Site :SITE,Id :number): Observable<any> {
      return this.http.put<any>(`${this.baseUrl}/approveOperation/siteservice/updateSite/${Id}`, Site);
  
    }
    

}
