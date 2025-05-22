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
import { DialogTableComponent } from '../dialog-table/dialog-table.component';
import { AddBankingDialogComponent } from '../../shared/add-banking-dialog/add-banking-dialog.component';
import { BankingService } from '../../services/banking.service';
import { DailogTABComponent } from '../../shared/dailog-tab/dailog-tab.component';
import { UpdateBankComponent } from '../../shared/update-bank/update-bank.component';
import { SnackbarService } from '../../services/snackbar.service';
import { BankAccountTableComponent } from '../../shared/bank-account-table/bank-account-table.component';
import { BankAccount } from '../../domain/Bank';

@Component({
  selector: 'app-banking',
  templateUrl: './banking.component.html',
  styleUrl: './banking.component.scss'
})
export class BankingComponent {
  displayedColumns = ['position', 'bankName', 'accId','ifscCode','balance','status','Operation' ];
  dataSource : any[];
  banks: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  loader: boolean = false;
  activeAccount: number =0;
  freezeAccount: number = 0;
  activeList: BankAccount[];
  currentdepo: number = 0;
  bankingTableArray:any[];
  FreezList:BankAccount[];
  constructor(
    public dialog: MatDialog,
    public paginatorServ : PaginatorService,
    private landingservice : SuperAdminLandingService,
    private depositsuperadminserv : DepositSuperadminService,
    private titleService : ComponettitleService,
    private  BankingService :BankingService,
    private snackbarService: SnackbarService,
    
    
  ) {}
  @ViewChild('fileInput') fileInput: ElementRef;
  
    
  ngOnInit(): void {
    this.fetchBanks();
    this.titleService.changeTitle('Banking panel');
    this.fetchFreezeBanksCount()
    this.fetchActiveBanksCount()
  
  
  }


  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
   
    dialogConfig.data = {
      initialData: "Deposit",
      userId: null,
  };
    
    const dialogRef = this.dialog.open(AddBankingDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
     
    });
  }

  openTADialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
   
    dialogConfig.data = {
      initialData: "Deposit",
      bankList:this.banks ,
  };
    
    const dialogRef = this.dialog.open(DailogTABComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
     
    });

  }

  openUpdateBank(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
   
    dialogConfig.data = {
      initialData: "Deposit",
      bankList:this.banks ,
  };
    
    const dialogRef = this.dialog.open(UpdateBankComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
     
    });


  }



  fetchBanks(): void {
    this.loader=true;
    this.BankingService.getAllAccountdata().subscribe(
      data => {
        this.dataSource = data;
        this.bankingTableArray=data;
        this.loader=false;
        // this.dataSource.shift();
   

      },
      error => {
        console.error('Error fetching banks', error);
        this.loader=false;
      }
    );
  }

  fetchActiveBanksCount(): void {
    this.BankingService.getCountActiveAccount().subscribe(
      data => {
        this.activeAccount = data;
       
      },
      error => {
        console.error('Error fetching banks', error);
      }
    );

    this.BankingService.getActiveList().subscribe(
      data => {
        this.activeList = data;
        // console.log(this.activeList);
       
      },
      error => {
        console.error('Error fetching banks', error);
      }
    );  

  }

  fetchFreezeBanksCount(): void {
    this.BankingService.getCountFreezeAccount().subscribe(
      data => {
        this.freezeAccount = data;
       
      },
      error => {
        console.error('Error fetching banks', error);
      }
    );

    this.BankingService.getFreezList().subscribe(
      data => {
        this.FreezList = data;
        console.log(this.activeList);
       
      },
      error => {
        console.error('Error fetching banks', error);
      }
    );  
  }






  
  filterData(searchTerm: string) {

    this.dataSource= this.bankingTableArray.filter(item =>
      item.bankName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
   }
   toggleStatus(id: number) {
    // Show a confirmation dialog
    const isConfirmed = confirm('Do you really want change status ?');
    this.loader = true;
    if (isConfirmed) {
      

      this.BankingService.switch(id).subscribe(
        (data) => {
          this.loader = false;
          this.snackbarService.snackbar('Success: status changed', 'success');
          
        },
        (error) => {
          console.log(error);
          this.loader = false;
        
        }
      );
    } else {
      // If the user cancels the confirmation, do nothing
      console.log('Deletion canceled by the user.');
    }
  }

   openActiveListDialog() {
   
    
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '78%';
     
      dialogConfig.data = {
        type: "Active",
        operation: this.activeList,
    };
      
      const dialogRef = this.dialog.open(BankAccountTableComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
       
      });
   
  
  }

  openFreezListDialog() {
   
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '78%';
   
    dialogConfig.data = {
      type: "Freeze",
      operation: this.FreezList,
  };
    
    const dialogRef = this.dialog.open(BankAccountTableComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
     
    });
 

}

}
