import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class SseServiceService {
  baseUrl: String = this.config.getBaseurl();

  constructor(private zone: NgZone, private config: AppConfigService) {}

  getServerSentEvent(): Observable<string> {
    return new Observable((observer) => {
      console.log('SSE Subscription start');
      const eventSource = new EventSource(`${this.baseUrl}/notify/subscribe`);

      // Default message handler (only works for unnamed events)
      eventSource.onmessage = (event) => {
        console.log('Received Default Message:', event.data);
        this.zone.run(() => observer.next(event.data));
      };

      // Listen for "new_approve_request" events
      eventSource.addEventListener(
        'new_approve_request',
        (event: MessageEvent) => {
          console.log('Received Approve Request:', event.data);
          this.zone.run(() => observer.next(event.data));
        }
      );

      // Error handling
      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        this.zone.run(() => observer.error(error));
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }

  getServerSentEvent2(): Observable<string> {
    return new Observable((observer) => {
      console.log('SSE Subscription start');
      const eventSource = new EventSource(`${this.baseUrl}/notify/sse/pendingDepoCount`);

      // Default message handler (only works for unnamed events)
      eventSource.onmessage = (event) => {
        console.log('Received Default Message:', event.data);
        this.zone.run(() => observer.next(event.data));
      };

      // Listen for "new_approve_request" events
      eventSource.addEventListener(
        'pending_request',
        (event: MessageEvent) => {
          console.log('Received Approve Request:', event.data);
          this.zone.run(() => observer.next(event.data));
        }
      );

      // Error handling
      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        this.zone.run(() => observer.error(error));
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }
  //================================withdraw================================
  getServerSentEventwithdraw(): Observable<string> {
    return new Observable((observer) => {
      console.log('SSE Subscription start');
      const eventSource = new EventSource(`${this.baseUrl}/notify/subscribe/with`);

      // Default message handler (only works for unnamed events)
      eventSource.onmessage = (event) => {
        console.log('Received Default Message:', event.data);
        this.zone.run(() => observer.next(event.data));
      };

      // Listen for "new_approve_request" events
      eventSource.addEventListener(
        'new_approve_request',
        (event: MessageEvent) => {
          console.log('Received Approve Request:', event.data);
          this.zone.run(() => observer.next(event.data));
        }
      );

      // Error handling
      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        this.zone.run(() => observer.error(error));
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }

  getServerSentEvent2withdraw(): Observable<string> {
    return new Observable((observer) => {
      console.log('SSE Subscription start');
      const eventSource = new EventSource(`${this.baseUrl}/notify/sse/pendingWithCount`);

      // Default message handler (only works for unnamed events)
      eventSource.onmessage = (event) => {
        console.log('Received Default Message:', event.data);
        this.zone.run(() => observer.next(event.data));
      };

      // Listen for "new_approve_request" events
      eventSource.addEventListener(
        'pending_request',
        (event: MessageEvent) => {
          console.log('Received Approve Request:', event.data);
          this.zone.run(() => observer.next(event.data));
        }
      );

      // Error handling
      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        this.zone.run(() => observer.error(error));
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }
}
