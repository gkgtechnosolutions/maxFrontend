// import { Injectable, OnDestroy } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { AppvDeposit } from '../domain/Deposite';

// @Injectable({
//   providedIn: 'root',
// })
// export class WebsocketService implements OnDestroy {
//   private websocket: WebSocket | undefined;
//   private depositsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
//     []
//   );

//   constructor() {
//     // Establish a WebSocket connection
//     this.websocket = new WebSocket(
//       'wss://bumpy-mammals-leave.loca.lt/websocket'
//     );

//     // Handle the WebSocket connection open event
//     this.websocket.onopen = () => {
//       console.log('Connected to WebSocket');

//       // Send a message to request data from the server
//       this.sendDepositRequest(['PENDING', 'APPROVED'], 0, 10);
//     };

//     // Handle incoming messages
//     this.websocket.onmessage = (event) => {
//       console.log('Received message:', event.data);

//       // Assuming the server sends a JSON response
//       try {
//         const deposits = JSON.parse(event.data);
//         console.log('Parsed deposits:', deposits); // Log the received data
//         this.depositsSubject.next(deposits);
//       } catch (error) {
//         console.error('Error parsing received message:', error);
//       }
//     };

//     // Handle WebSocket errors
//     this.websocket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     // Handle WebSocket closure
//     this.websocket.onclose = (event) => {
//       console.log('WebSocket closed:', event);
//     };
//   }

//   // Method to send a request to the server
//   public sendDepositRequest(
//     statuses: string[],
//     pageNo: number = 0,
//     pageSize: number = 10
//   ): void {
//     debugger;
//     const request = {
//       statuses: statuses,
//       pageNo: pageNo,
//       pageSize: pageSize,
//     };

//     if (true) {
//       this.websocket.send(JSON.stringify(request));
//       console.log('Request sent:', request);
//     } else {
//       console.error('WebSocket is not open. Cannot send request.');
//     }
//   }

//   // Method to get the deposits as an observable
//   public getDeposits(): Observable<any[]> {
//     return this.depositsSubject.asObservable();
//   }

//   // Cleanup when the service is destroyed
//   ngOnDestroy(): void {
//     if (this.websocket) {
//       this.websocket.close();
//     }
//   }
// }
