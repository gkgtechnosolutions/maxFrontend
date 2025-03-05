import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
declare var appConfig;
@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private baseUrl: String = appConfig.mainbackendUrl;
  private baseUrlws: string = appConfig.mainbackendUrlws;
  constructor() {}


  setSecBackendUrl(): string{
      this.baseUrl = appConfig.secbackendUrl;
      return "sucess";
  }

  getBaseurl(): String {
    return this.baseUrl;
  }

  // getBaseurlws(): string {
  //   return this.baseUrlws;
  // }


}
