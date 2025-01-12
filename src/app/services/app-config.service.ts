import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
declare var appConfig;
@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private baseUrl: String = appConfig.mainbackendUrl;
  constructor() {}


  setSecBackendUrl(): string{
      this.baseUrl = appConfig.secbackendUrl;
      return "sucess";
  }

  getBaseurl(): String {
    return this.baseUrl;
  }
}
