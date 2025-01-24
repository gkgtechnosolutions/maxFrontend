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
import { Operation, Operations } from '../../domain/operation';
import { DepositTable } from '../../domain/table';
import { ComponettitleService } from '../../services/componenttitle.service';
import { DialogTableComponent } from '../../superadmin/dialog-table/dialog-table.component';
import { SupADepositService } from '../../services/sup-adeposit.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SupDtableComponent } from '../sup-dtable/sup-dtable.component';
 

@Component({
  selector: 'app-sup-adeposit',
  templateUrl: './sup-adeposit.component.html',
  styleUrl: './sup-adeposit.component.scss'
})
export class SupAdepositComponent {
  displayedColumns = ['position', 'userId', 'count' ];
  dataSource : any[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  todaydeposit:number = 0;
  loader: boolean = false;
  totaldeposite: number =0;
  currentdepo: number = 0;
  depositTableArray:any[];
  constructor(
    public dialog: MatDialog,
    public paginatorServ : PaginatorService,
    private landingservice : SuperAdminLandingService,
    private supADeposit: SupADepositService,
    private depositsuperadminserv : DepositSuperadminService,
    private titleService : ComponettitleService,
    private snackbarService: SnackbarService,
    
    
  ) {}
  @ViewChild('fileInput') fileInput: ElementRef;
  
  ngOnInit(): void {
    this.titleService.changeTitle('Sup-ADeposit panel');
    this.getDeposite();
    this.getTodayDeposit()
    this.getDepositeTabledata();
  }
  


  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
   
    dialogConfig.data = {
      initialData: "Deposit",
      userId: null,
  };
    
    const dialogRef = this.dialog.open(DWModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
     
    });
  }
  filterData(searchTerm: string) {
      
   this.dataSource= this.depositTableArray.filter(item =>
      item.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }



  getDeposite() {
   
    this.supADeposit.getDepositRequestCount().subscribe(
      (data) => {
      
       if(data!=this.currentdepo|| this.totaldeposite===0){
        this.totaldeposite = data;
        this.currentdepo=this.totaldeposite;
       }  
      },
      (error) => {
        this.snackbarService.snackbar('failed!', 'error');
      }
    );




  }
  getTodayDeposit() {
    
    this.supADeposit.getTodaysDeposit().subscribe(
      (data) => {
        console.log("getTodayDeposit"+data);
 
        this.todaydeposit = data;
      
       } , 
    
      (error) => {
        this.snackbarService.snackbar('failed to Get TodayDeposit', 'error');
      }
    );
  }

  getDepositeTabledata() {
    this.loader = true;
    this.supADeposit.getDepositdata().subscribe(
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
        this.snackbarService.snackbar('failed!', 'error');
        this.loader = false;
      
      }
    );
  }

  openLastWeekDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70%';
    // dialogConfig.height ='90%';
    dialogConfig.data = {
      operation : "Deposit",
      type : "Lastweek's",
    };
  
    const dialogRef = this.dialog.open(SupDtableComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
     
    });
  }

  openTotalDepositeDialog() {
    console.log("in total open dialog");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70%';
    // dialogConfig.height ='90%';
    dialogConfig.data = {
      operation : "Deposit",
      type : "Total",
    };
   
    const dialogRef = this.dialog.open(SupDtableComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
     
    });
  }
  

  openTodaysDepositeDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70%';
    // dialogConfig.height ='90%';
    dialogConfig.data = {
      operation : "Deposit",
      type : "Today's",
    };
   
    const dialogRef = this.dialog.open(SupDtableComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
     
    });
  }

}
