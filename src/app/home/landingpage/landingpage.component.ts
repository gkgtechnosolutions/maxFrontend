import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponettitleService } from '../../services/componenttitle.service';
import { Subscription } from 'rxjs';
import { SseServiceService } from '../../services/sse-service.service';

@Component({
  selector: 'app-landingpage',

  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss',
})
export class LandingpageComponent implements OnInit , OnDestroy {
  private sseSubscription?: Subscription;
  notificationCount: any;
 
  constructor(
    private route: Router,
    private titleService: ComponettitleService,
    private sseService: SseServiceService,
  ) {}


  Operator: string;

  ngOnInit(): void {
    this.getrole();
  if(this.Operator==="APPROVEDEPOSIT"){
    this.sseSubscription = this.sseService.getServerSentEvent2().subscribe({
      next: (message) => {
        console.log('Received:', message);
        this.showNotification(message);
      },
      error: (err) => console.error('Error:', err),
    });
  }
    this.titleService.changeTitle('Dashboard');
   
  }
  ngOnDestroy(): void {
    if(this.Operator==="APPROVEDEPOSIT"){
    this.sseSubscription.unsubscribe();}
  }
 
  navigateToPage(component: String): void {
    this.route.navigateByUrl(`home/${component}`);
  }

  getrole() {
    const userString = localStorage.getItem('user');
    if (userString) {
      // Step 2: Access user_role attribute
      const user = JSON.parse(userString);
      this.Operator = user.role_user;
    }
  }

  showNotification(message: string) {
    if (!('Notification' in window)) {
      console.error('This browser does not support desktop notifications.');
      return;
    }

    // Request permission if not already granted
    if (Notification.permission === 'granted') {
      this.playNotificationSound();
      this.incrementNotificationCount();
      new Notification('New Message Received', {
        body: message,
        icon: 'assets/notification-icon.png', // Optional: Add an icon
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('New Message Received', {
            body: message,
            icon: 'assets/notification-icon.png',
          });
        }
      });
    }
  }
  playNotificationSound() {
    const audio = new Audio('assets/542043_6856600-lq.mp3'); // Path to the sound file

    audio.volume = 1.0; // Set volume (0.0 to 1.0), 0.3 is ~30% of full volume

    audio.play().catch((err) => console.error('Error playing sound:', err));
  }
  incrementNotificationCount() {
    this.notificationCount++;
    document.title = `(${this.notificationCount}) New Notifications`; // Update title bar
  }
  clearNotificationCount() {
    this.notificationCount = 0;
    document.title = 'My Website'; // Reset to default title
  }

}
