
import { Component, Inject, SimpleChanges} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Operation, Operations } from '../../domain/operation';
import { RetryService } from '../../services/retry.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ReportService } from '../../services/report.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankingService } from '../../services/banking.service';
import { BankAccount, BankAccountTransfer } from '../../domain/Bank';
import { BankingComponent } from '../../superadmin/banking/banking.component';


@Component({
  selector: 'app-dailog-tab',
  templateUrl: './dailog-tab.component.html',
  styleUrl: './dailog-tab.component.scss'
})
export class DailogTABComponent {
  opNumber : number=1;
  prograsbar: boolean = false;
  saveData ='Deposit';
  displayedColumns: string[] ;
  loader: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  private retryserv : RetryService ,
  private snackbarService:SnackbarService,
  private fb: FormBuilder,
  private bank:BankingService
) { 
 
  
  }
  bankAccountForm: FormGroup;
  banks: any[] = [];



  ngOnInit(): void {
    this.fetchBanks();
    this.bankAccountForm = this.fb.group({
      id: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]]
    });
    }
    
   




  fetchBanks(): void {
    this.loader=true;
    this.bank.getAllAccountdata().subscribe(
      (accounts: BankAccount[]) => {
        this.banks=accounts;
        this.loader=false;
      },
      error => {
        console.error('Error fetching banks', error);
        this.loader=false;
      }
    );
  }

  onToggle(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.saveData = inputElement.checked ?  'Withdraw':'Deposit' ;
    this.opNumber= inputElement.checked ? 2 : 1;
    // this.myFormValues()
    console.log(this.saveData); // for debugging purposes, to see the current value of `data`
  }


  onSubmit(): void {
    this.loader = true;
    console.log('onSubmit');
 
   
      const bankAccount: BankAccountTransfer  = this.bankAccountForm.value;
       bankAccount.opNumber=this.opNumber;
       console.log(bankAccount);

      this.bank.transferAmount(bankAccount).subscribe(response => {
        this.snackbarService.snackbar('Amount added successfully!', 'success');
        console.log('Account created successfully!', response);
        this.loader= false;
        this.resetForm()
      }, error => {
        this.resetForm()
        this.loader= false;
        this.snackbarService.snackbar('failed!', 'error');
        console.error('Error creating account:', error);
        confirm(error);
      });
   
  }

  resetForm() {
    this.bankAccountForm .reset(); // Reset form values
    this.bankAccountForm .markAsPristine(); // Mark form as pristine
    this.bankAccountForm .markAsUntouched(); // Mark form as untouched
    Object.values(this.bankAccountForm .controls).forEach((control) => {
      control.setErrors(null); // Reset validation errors for each control
    });
  }

}
