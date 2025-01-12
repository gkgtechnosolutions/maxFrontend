import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {

  constructor(private http: HttpClient) { }

  getUsersDeposite(page: number = 1, pageSize: number = 10): Observable<any[]> {
    // Adjust the URL to match your API endpoint
    const url = `https://your-api.com/usersdeposite?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any[]>(url);
  }


  getUsersWithdraw(page: number = 1, pageSize: number = 10): Observable<any[]> {
    // Adjust the URL to match your API endpoint
    const url = `https://your-api.com/userswithdraw?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any[]>(url);
  }
}
