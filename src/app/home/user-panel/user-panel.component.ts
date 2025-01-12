import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AddAppUserComponent } from '../../shared/add-app-user/add-app-user.component';
import { AppUserService } from '../../services/app-user.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.scss'
})
export class UserPanelComponent {
ActiveUser: any;
BlockUser: any;
displayedColumns = ['position', 'userId', 'count' ];
dataSource : any[];
depositTableArray:any[];
  loader: boolean;
  Operator: any;
constructor(public dialog: MatDialog, private appuserserv :AppUserService) {}
ngOnInit(): void{
  this.getuserID()
  this.fetchUser();
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
      
  this.dataSource= this.depositTableArray.filter(item =>
     item.userId.toLowerCase().includes(searchTerm.toLowerCase())
   );
 }

 fetchUser(): void {
  this.loader=true;
  this.appuserserv.getUserDetails(this.Operator).subscribe(
    data => {
      this.dataSource = data;
     
      this.loader=false;
      // this.dataSource.shift();
 

    },
    error => {
      console.error('Error fetching banks', error);
      this.loader=false;
    }
  );
}

}
