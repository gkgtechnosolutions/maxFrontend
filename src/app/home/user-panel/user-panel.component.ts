import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AddAppUserComponent } from '../../shared/add-app-user/add-app-user.component';
import { AppUserService } from '../../services/app-user.service';
import { UpAppvlistComponent } from '../../shared/up-appvlist/up-appvlist.component';
import { ComponettitleService } from '../../services/componenttitle.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.scss'
})
export class UserPanelComponent {
  ActiveUser: any;
  BlockUser: any;
  displayedColumns = ['position', 'userId', 'count', 'operation'];
  dataSource: any[];
  depositTableArray: any[];
  loader: boolean;
  Operator: any;
  role: string = "APPROVEDEPOSIT";
  obj: any;
  constructor(public dialog: MatDialog, private appuserserv: AppUserService, private titleService: ComponettitleService) {
    this.titleService.changeTitle('User Panel');
  }
  ngOnInit(): void {
    this.getuserID()
    this.fetchUserAsRole(this.role);
  }
  isApproveDeposit = true; // Default role

  onToggleRole(event: any): void {
    this.isApproveDeposit = event.checked;
    this.role = this.isApproveDeposit ? 'APPROVEDEPOSIT' : 'APPROVEWITHDRAW';
    // Call your method with the selected role
    this.fetchUserAsRole(this.role);
  }

  filterData2(role: string): void {
    console.log('Selected Role:', role);
    // Your existing filtering logic here
  }

  openDialogdetail(userId: number, role: String): void {
    this.loader = true;
    if (role == 'APPROVEDEPOSIT') {
      this.appuserserv.getDepositList(userId).subscribe(
        data => {
          this.obj = data;
          this.loader = false;
          const dialogConfig = new MatDialogConfig();
          dialogConfig.width = '67%';
          dialogConfig.data = {
            obj: this.obj,
          };


          const dialogRef = this.dialog.open(UpAppvlistComponent, dialogConfig);
          dialogRef.afterClosed().subscribe((result) => {

          });
        },
        error => {
          console.error('Error fetching banks', error);
          this.loader = false;
        }
      );
    }
    else if (role == 'APPROVEWITHDRAW') {
      this.appuserserv.getWithdrawList(userId).subscribe(
        data => {
          this.obj = data;
          this.loader = false;
          const dialogConfig = new MatDialogConfig();
          dialogConfig.width = '67%';
          dialogConfig.data = {

            obj: this.obj,
          };


          const dialogRef = this.dialog.open(UpAppvlistComponent, dialogConfig);
          dialogRef.afterClosed().subscribe((result) => {

          });
        },
        error => {
          console.error('Error fetching banks', error);
          this.loader = false;
        }
      );

    }


  }
  openDialog() {


    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40%';
    // dialogConfig.data = this.operations;
    dialogConfig.data = {
      initialData: 'Deposit',

    };


    const dialogRef = this.dialog.open(AddAppUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {

    });
  }

  getuserID() {
    const userString = localStorage.getItem('user');
    if (userString) {
      // Step 2: Access user_role attribute
      const user = JSON.parse(userString);
      this.Operator = user.user_id;
    }
  }

  filterData(searchTerm: string) {

    this.dataSource = this.depositTableArray.filter(item =>
      item.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  fetchUser(): void {
    this.loader = true;
    this.appuserserv.getUserDetails(this.Operator).subscribe(
      data => {
        this.dataSource = data;
        this.loader = false;
        // this.dataSource.shift();
      },
      error => {
        console.error('Error fetching banks', error);
        this.loader = false;
      }
    );
  }

  fetchUserAsRole(role: string): void {
    this.loader = true;
    this.appuserserv.getUserDetailsAsRole(this.Operator, role).subscribe(
      data => {
        this.dataSource = data;
        this.loader = false;
        // this.dataSource.shift();
      },
      error => {
        console.error('Error fetching banks', error);
        this.loader = false;
      }
    );
  }
  blockUser(userId: number): void {

    this.loader = true;
    this.appuserserv.blockUser(userId).subscribe(
      data => {
        this.BlockUser = data;
        this.fetchUser();
        this.loader = false;
      },
      error => {
        console.error('Error fetching banks', error);
        this.loader = false;
      }
    );

  }
}
