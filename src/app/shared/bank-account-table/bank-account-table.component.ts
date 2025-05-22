import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { ReportService } from '../../services/report.service';
import { BankingService } from '../../services/banking.service';

@Component({
  selector: 'app-bank-account-table',
  templateUrl: './bank-account-table.component.html',
  styleUrl: './bank-account-table.component.scss'
})
export class BankAccountTableComponent {
  displayedColumns = ['position', 'bankName', 'accId','ifscCode','balance','status','Operation' ];
  dataSource : any[];
  banks: any[] = [];
  dataType: any;
  loader: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  
  private snackbarService:SnackbarService,
  private report: ReportService,
  private  BankingService :BankingService,
 
  
  
) { 
    this.dataType = data.type;
    this.dataSource=data.operation;


    
    

  
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
          this.snackbarService.snackbar('failed!', 'error');
          console.log(error);
          this.loader = false;
        
        }
      );
    } else {
      // If the user cancels the confirmation, do nothing
      console.log('Deletion canceled by the user.');
    }
  }

}
