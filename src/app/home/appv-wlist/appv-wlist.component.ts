import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SearchsuperadminService } from '../../services/searchsuperadmin.service';
import { LastweekdataService } from '../../services/lastweekdata.service';
import { ComponettitleService } from '../../services/componenttitle.service';
import { MatDialog } from '@angular/material/dialog';
import { ApproveService } from '../../services/approve.service';
import { SnackbarService } from '../../services/snackbar.service';
import { CheckAppvDailogComponent } from '../../shared/check-appv-dailog/check-appv-dailog.component';
import { interval, Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { SseServiceService } from '../../services/sse-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-appv-wlist',
  templateUrl: './appv-wlist.component.html',
  styleUrl: './appv-wlist.component.scss',
})
export class AppvWlistComponent implements OnInit , OnDestroy { 
  searchText: boolean;
  userId: any;
  user: any;
  notificationCount: any = 0;

  openEditDialog(arg0: any) {
    throw new Error('Method not implemented.');
  }

  isButtonClicked: { [key: number]: boolean } = {};
  searchTerm: string;
  loader: any;
  pageNo: number = 0;
  pageSize: number = 8;
  page: any;
  withdraws: any;
  paginator: any;
  private subscription: Subscription;
  notificationsEnabled = false;
  private sseSubscription?: Subscription;
  private sseSubscription2?: Subscription;

  constructor(
    private searchService: SearchsuperadminService,
    private sseService: SseServiceService,
    private lastweekdata: LastweekdataService,
    private titleService: ComponettitleService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private apprvserv: ApproveService,
    private snackbarService: SnackbarService // private webSocketService: WebsocketService
  ) {
    this.titleService.changeTitle('Approve Withdraw List');

   
    this.getWithdraws();
    this.subscription = interval(10000).subscribe(() => {
     

      this.getWithdraws();
     
    });
  }
  ngonInit() {
    window.addEventListener('focus', () => this.clearNotificationCount());

   
  }

  refresh() {
    this.getWithdraws();
  }
  selectedStatuses = new FormControl('');
  statuses: string[] = [
    'ALL',
    'PENDING',
    'APPROVED',
    'IN_PROCESS',
    'REJECTED',
    'DONE',
    'FAILED',
    'DELETED',
    'MESSAGE_SENT',
    'INSUFFICIENT_BALANCE',
  ];
  onSearchClick() {
    throw new Error('Method not implemented.');
  }
  updateSearchText($event: Event) {
    throw new Error('Method not implemented.');
  }
  // Define the displayed columns
  displayedColumns: string[] = [
    'Sr.no',
    'userId',
    'utrNumber',
    'amount',
    'entryTime',
    'site',
    'approveWithdrawStatus',
    'approve',
    'Operations',
  ];

  // Define the data source (replace with your real data)
  dataSource;

  ngOnInit(): void {
    this.selectedStatuses.valueChanges.subscribe((selectedStatuses) => {
      this.onStatusChange(selectedStatuses);
    });
    this.sseSubscription2 = this.sseService.getServerSentEvent2withdraw().subscribe({
      next: (message) => {
        console.log('Received:', message);
        this.showNotification(message);
      },
      error: (err) => console.error('Error:', err),
    });
    this.getWithdraws();
    this.getUserId();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.stopNotifications();
   
      this.sseSubscription2.unsubscribe();
   
  }
  

  getWithdraws(): void {
    const statusesToSend =
      this.selectedStatuses.value.length > 0
        ? this.selectedStatuses.value
        : ['PENDING', 'IN_PROCESS', 'FAILED', 'APPROVED', 'DONE'];
    this.apprvserv
      .getSelectionWithdrawdata(statusesToSend, this.pageSize, this.pageNo)
      .subscribe(
        (data) => {
          this.page = data;
          this.withdraws = data.content;
          // console.log( this.deposits);
          if (this.paginator) {
            this.paginator.length = data.totalElements; // Update paginator length with total elements
          }
          this.loader = false; // Update the paginator length with total elements
        },
        (
          error) => {
          console.log(error);
          this.loader = false;
        }
      );
  }

  disableButton(userId): void {
    // Set the clicked state for the corresponding user.id to true
    this.isButtonClicked[userId] = true;
  }
  retry(id: number) {
    this.loader = true;
    this.apprvserv.retryWithdraw(id).subscribe(
      (data) => {
        this.snackbarService.snackbar(
          'Withdrawal request has been retried successfully.',
          'Dismiss'
        );
        this.getWithdraws();
        this.loader = false;
      },
      (error) => {
        console.log(error + ': error');
        this.loader = false;
        this.snackbarService.snackbar(
          'Failed to retry withdrawal request.',
          'Dismiss'
        );
      }
    );
  }

  checkApprove(user) {
    const dialogRef = this.dialog.open(CheckAppvDailogComponent, {
      width: '800px',
      data: {
        user: user,
        type: 'withdraw',
      }, // Pass the user object to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle logic after the dialog is closed, if required (e.g., refreshing data)
        // console.log('Dialog result:', result);
        this.getWithdraws();
      }
    });
  }

  onStatusChange(newStatuses): void {
    this.pageNo = 0; // Reset to the first page whenever the filter changes
    if (this.paginator) {
      this.paginator.firstPage(); // Reset paginator to first page
    } // Reset paginator to first page
    this.getWithdraws();
  }

  deleteReport(Id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: null,
    });
    dialogRef.afterClosed().subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.loader = true;
        this.apprvserv.deleteWithdraw(Id, this.userId).subscribe({
          next: (response) => {
            this.snackbarService.snackbar('Deleted successful', 'success');
            this.getWithdraws();
            this.loader = false;
            // Handle success logic, e.g., showing a notification or refreshing the list
          },
          error: (error) => {
            console.error('Delete failed', error);
            this.loader = false;
            // Handle error logic, e.g., showing an error message
          },
        });
      }
    });
  }

  getUserId() {
    const userData = localStorage.getItem('user');

    if (userData) {
      this.user = JSON.parse(userData);
      this.userId = this.user.user_id; // Get the user ID from localStorage
    } else {
      // Handle the case when user data is not available
      console.error('User data not found in localStorage');
      return;
    }
  }

  //--------------------------------------------------
  showSnackbar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 0, 
      horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
      verticalPosition: 'bottom', // 'top', 'bottom'
    });
  }
  showNotification(message: string) {
    this.playNotificationSound();
    this.showSnackbar(message, 'New Notifiation');
    
    if (!('Notification' in window)) {
      console.error('This browser does not support desktop notifications.');
      return;
    }

    // Request permission if not already granted
    if (Notification.permission === 'granted') {
    
      this.incrementNotificationCount();
      this.snackbarService.snackbar('New Notification !!', 'success');
      new Notification('New Message Received', {
        body: message,
        icon: 'assets/notification-icon.png', // Optional: Add an icon
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('New Message Received', {
            body: message,
           
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

  toggleNotifications() {
    if (this.notificationsEnabled) {
      this.stopNotifications();
    } else {
      this.startNotifications();
    }
    this.notificationsEnabled = !this.notificationsEnabled;
  }

  startNotifications() {
    this.sseSubscription = this.sseService.getServerSentEvent().subscribe({
      next: (message) => {
        this.getWithdraws();
        console.log('Received:', message);
        this.showNotification(message);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  stopNotifications() {
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
      console.log('SSE Subscription stopped');
    }
  }
}

// Sample data (replace this with your actual data)
