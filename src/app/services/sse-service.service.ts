import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SseServiceService {
  baseUrl: String = this.config.getBaseurl();

  constructor(private zone: NgZone, private config :AppConfigService) {}

  getServerSentEvent(): Observable<string> {

    return new Observable(observer => {
      console.log('SSE Subscription start');
      const eventSource = new EventSource(`${this.baseUrl}/notify/subscribe`);

      eventSource.onmessage = (event) => {

        console.log('Received Message:');
        this.zone.run(() => observer.next(event.data));
      };

      eventSource.onerror = (error) => {
        this.zone.run(() => observer.error(error));
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }
}
