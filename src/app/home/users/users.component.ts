import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OperationsService } from '../../services/operations.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ComponettitleService } from '../../services/componenttitle.service';
// import { UpdatePasswordComponent } from '../update-password/update-password.component';
import { UpdatePassDiallogComponent } from '../update-pass-diallog/update-pass-diallog.component';
import { DWModalComponent } from '../dw-modal/dw-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  displayedColumns: string[] = ['userId', 'siteName', 'masterName','update'];
  dataSource = new MatTableDataSource();
  typingTimer: any;
  doneTypingInterval = 800;
  loader1: boolean;
  loader2: boolean;
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private operation: OperationsService,
    public dialog: MatDialog,
    private   titleService:ComponettitleService
  ) {}

  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.titleService.changeTitle('User panel');
    this.dataSource.sort = this.sort;
  }
  
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  getUser(username: string) {
    this.loader1 = true;
    this.operation.findUser(username).subscribe(
      (data) => {
        console.log(data);
        const mappedData = data.map((item: any) => ({
          userId: item.user.userId,
          siteName: item.user.site.name,
          masterName: item.masterName,
        }));

        // Assign the mapped data to the MatTableDataSource
        this.dataSource.data = mappedData;
        this.loader1 = false;
      },
      (error) => {
        console.error(error);
        this.loader1 = false;
      }
    );
  }

  onUserInput(event: any) {
    const inputElement: HTMLInputElement = event.target;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.getUser(inputElement.value);
    }, this.doneTypingInterval);
  }

  
  //-----------------dial-log---------------------------


  openDialog( userId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.data = userId;
    console.log('in dialog');
    const dialogRef = this.dialog.open( UpdatePassDiallogComponent , dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDepositDialog(userId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    // dialogConfig.height= '80%';
    dialogConfig.data = {
      initialData: "Deposit",
      userId: userId
  };
    // console.log('in dialog');
    const dialogRef = this.dialog.open(DWModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }


  openWithdrawDialog(userId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    // dialogConfig.height= '80%';
    dialogConfig.data = {
      initialData: "Withdraw",
      userId: userId
    };
    // console.log('in dialog');
    const dialogRef = this.dialog.open(DWModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }




}
