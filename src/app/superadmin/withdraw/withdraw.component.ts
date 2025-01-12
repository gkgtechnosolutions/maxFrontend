import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OperationsService } from '../../services/operations.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';


import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DWModalComponent } from '../dw-modal/dw-modal.component';
import { MatSort } from '@angular/material/sort';
import { PaginatorService } from '../../services/paginator.service';
import { SuperAdminLandingService } from '../../services/super-admin-landing.service';
import { DepositSuperadminService } from '../../services/deposit-superadmin.service';
import { WithdrawSuperadminService } from '../../services/withdraw-superadmin.service';
import { ComponettitleService } from '../../services/componenttitle.service';
import { DialogTableComponent } from '../dialog-table/dialog-table.component';


@Component({
  selector: 'app-withdraw',

  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.scss',
})
export class WithdrawComponent {
  todayWithdraw :number = 0;
  displayedColumns = ['position', 'userId', 'count' ];
  dataSource : any[];
  totalwithdraw: number=0 ;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  depositTableArray:any[];
  loader: boolean = false;

  constructor(
    public dialog: MatDialog,
    public paginatorServ : PaginatorService,
    private landingservice : SuperAdminLandingService,
    private withdrawsuperadminserv:WithdrawSuperadminService,
    private   titleService:ComponettitleService
    
  ) {}
  @ViewChild('fileInput') fileInput: ElementRef;
  
  ngOnInit(): void {
    this.titleService.changeTitle('Withdraw panel');
    this.getWithdraW();
    this.getTodayWithdraw();
    this.getWithDrawTabledata();
    
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.width = '80%';
    
    dialogConfig.data = {
      initialData: "Withdraw",
      userId: null,
  };
    console.log('in dialog');
    const dialogRef = this.dialog.open(DWModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  filterData(searchTerm: string) {
      
    this.dataSource= this.depositTableArray.filter(item =>
       item.userId.toLowerCase().includes(searchTerm.toLowerCase())
     );
   }

  //===================================paginator service================================
  // fetchUsers() {
  //   // Call your service to fetch users, assuming it returns an Observable
  //   this.paginatorServ.getUsersWithdraw().subscribe(users => {
  //     this.dataSource = users ;
  //   });
  // }

  // nextPage(event: any) {
  //   // If next page button is clicked
  //   if (event.previousPageIndex < event.pageIndex) {
  //     // Assuming your service method takes page number and page size as arguments
  //     this.paginatorServ.getUsersWithdraw(event.pageIndex + 1, this.paginator.pageSize).subscribe(users => {
  //       this.dataSource = users;
  //     });
  //   }
  // }
  //===================================================================================
  getWithdraW() {
  
    this.landingservice.getWithdraw().subscribe(
      (data) => {
      
    
        this.totalwithdraw = data;
       
      },
      (error) => {
        console.error(error);
        // Handle error
        
      }
    );
  }

  getWithDrawTabledata() {
    this.loader = true;
    this.withdrawsuperadminserv.getWithdrawdata().subscribe(
      (data) => {
      console.log(data);
     
      this.dataSource=Object.entries(data).map(([userId, count]) => ({
        userId,
        count
    }))
    this.depositTableArray=this.dataSource;
    this.loader = false;
        
      },
      (error) => {
        console.error(error);
        this.loader = false;
      
      }
    );
  }

  getTodayWithdraw() {
    
    this.landingservice.getTodaysWithdraw().subscribe(
      (data) => {
        console.log("getTodayWithdraw"+data);
 
        this.todayWithdraw = data;
      
       } , 
    
      (error) => {
        console.error(error);
      }
    );
  }



  openLastWeekDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70%';
    dialogConfig.data = {
      operation : "Withdraw",
      type : "Lastweek's",
    };
    const dialogRef = this.dialog.open(DialogTableComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
     
    });
  }

  openTotalWithdrawDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70%';
  
    dialogConfig.data = {
      operation : "Withdraw",
      type : "Total",
    };
   
    const dialogRef = this.dialog.open(DialogTableComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
     
    });
  }
  

  openTodaysWithdrawDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70%';
   
    dialogConfig.data = {
      operation : "Withdraw",
      type : "Today's",
    };
   
    const dialogRef = this.dialog.open(DialogTableComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
     
    });
  }


  }

 

 




