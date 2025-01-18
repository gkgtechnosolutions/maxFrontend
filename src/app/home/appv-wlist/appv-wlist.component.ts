import { Component } from '@angular/core';
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

@Component({
  selector: 'app-appv-wlist',
  templateUrl: './appv-wlist.component.html',
  styleUrl: './appv-wlist.component.scss'
})
export class AppvWlistComponent {
  searchText: boolean;
  userId: any;
  user: any;

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

constructor(
  private searchService: SearchsuperadminService,
 
  private lastweekdata: LastweekdataService,
  private titleService: ComponettitleService,

  public dialog: MatDialog,
  private apprvserv: ApproveService,
  private snackbarService: SnackbarService,
) // private webSocketService: WebsocketService

{

  this.titleService.changeTitle('Approve Withdraw List');
  // this.dateRange = { start: null, end: null };
  
  this.subscription = interval(10000).subscribe(() => {
    // if (this.searchText && this.searchText.trim() !== '') {
    //   this.pageNo = 0; // Reset to first page for a new search
    //   this.searchDeposits();
    // } else {
    
   
      this.getWithdraws();
    // }
  });
}
refresh() {
throw new Error('Method not implemented.');
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
   displayedColumns: string[] = ['Sr.no','userId', 'utrNumber', 'amount', 'entryTime', 'site', 'approveWithdrawStatus','approve', 'Operations'];
  
   // Define the data source (replace with your real data)
   dataSource ;
 
   ngOnInit(): void {
    this.selectedStatuses.valueChanges.subscribe((selectedStatuses) => {
      this.onStatusChange(selectedStatuses);
    });
    this.getWithdraws();
    this.getUserId();
   }


   getWithdraws(): void {
   
    const statusesToSend =
      this.selectedStatuses.value.length > 0
        ? this.selectedStatuses.value
        : ['PENDING', 'IN_PROCESS', 'FAILED', 'APPROVED','DONE'];
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
        (error) => {
          console.log(error);
          this.loader = false;
        }
      );
  }

  disableButton(userId ): void {
    // Set the clicked state for the corresponding user.id to true
    this.isButtonClicked[userId] = true;
  }
 retry(id:number){
  this.loader=true;
  this.apprvserv.retryWithdraw(id).subscribe((data) => {
    this.snackbarService.snackbar('Withdrawal request has been retried successfully.', 'Dismiss');
    this.getWithdraws();
    this.loader=false;
  },(error) => {
    console.log(error + ': error');
    this.loader=false;
    this.snackbarService.snackbar('Failed to retry withdrawal request.', 'Dismiss');
  });
 }

 checkApprove(user) {
  const dialogRef = this.dialog.open(CheckAppvDailogComponent, {
    width: '800px',
    data: {
      user: user,
      type: "withdraw",
    }  // Pass the user object to the dialog
  });

  dialogRef.afterClosed().subscribe(result => {
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
    }
  })
}
});
}
 

getUserId(){
  const userData = localStorage.getItem('user');


  if (userData) {
    this.user = JSON.parse(userData);
    this.userId = this.user.user_id;  // Get the user ID from localStorage
  } else {
    // Handle the case when user data is not available
    console.error('User data not found in localStorage');
    return;
  }
}

 }

 
 // Sample data (replace this with your actual data)
 


