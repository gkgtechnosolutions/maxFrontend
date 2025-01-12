import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenCheckService {
  // private tokenCheckInterval = 20 * 60 * 1000; // 20 minutes in milliseconds
  // private subscription: Subscription;

  // constructor(private authService: AuthService) {}

  // startTokenCheck(): void {
  //   this.stopTokenCheck(); // Ensure no duplicate checks are running

  //   this.subscription = interval(this.tokenCheckInterval).subscribe(() => {
  //     const token = localStorage.getItem('token');

  //     if (token) {
  //       // Implement your token validation logic
  //       this.authService.validateToken(token).subscribe(
  //         (isValid) => {
  //           if (!isValid) {
  //             console.warn('Token is invalid or expired. Logging out...');
  //             this.authService.logout();
  //           }
  //         },
  //         (error) => {
  //           console.error('Error during token validation:', error);
  //           this.authService.logout();
  //         }
  //       );
  //     } else {
  //       console.warn('No token found. Logging out...');
  //       this.authService.logout();
  //     }
  //   });
  // }

  // stopTokenCheck(): void {
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  // }
}
