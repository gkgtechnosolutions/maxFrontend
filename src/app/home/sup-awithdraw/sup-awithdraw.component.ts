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
import { SupADepositService } from '../../services/sup-adeposit.service';
import { SupDtableComponent } from '../sup-dtable/sup-dtable.component';


@Component({
  selector: 'app-sup-awithdraw',
  templateUrl: './sup-awithdraw.component.html',
  styleUrl: './sup-awithdraw.component.scss'
})
export class SupAWithdrawComponent {
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
    private supADeposit: SupADepositService,
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


  getWithdraW() {
  
    this.supADeposit.getWithdraw().subscribe(
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
    
    this.supADeposit.getTodaysWithdraw().subscribe(
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
    // const dialogRef = this.dialog.open(DialogTableComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((result) => {
     
    // });
  }

  openTotalWithdrawDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70%';
  
    dialogConfig.data = {
      operation : "Withdraw",
      type : "Total",
    };
   
    const dialogRef = this.dialog.open(SupDtableComponent, dialogConfig);
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
   
    // const dialogRef = this.dialog.open(DialogTableComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((result) => {
     
    // });
  }


}
