
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
import { BankAccount } from '../../domain/Bank';

@Component({
  selector: 'app-add-banking-dialog',
  templateUrl: './add-banking-dialog.component.html',
  styleUrl: './add-banking-dialog.component.scss'
})
export class AddBankingDialogComponent {
  prograsbar: boolean = false;
  operations: Operation[] ;
  operation:string;
  operator:number;
  displayedColumns: string[] ;
  loader: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  private retryserv : RetryService ,
  private snackbarService:SnackbarService,
  private fb: FormBuilder,
  private bank:BankingService
) { 
    this.operator = data.userId;
    this.operations=data.operation;
    this.operation=data.initialData;
  }



  bankFormGroup: FormGroup;


  

  ngOnInit(): void {
    this.bankFormGroup = this.fb.group({
      id: [''],
      bankHolderName: [''],
      bankName: [''],
      accountNumber: [''],
      ifscCode: ['' ],
      gpayUPI: [''],
      phonePeUPI: [''],
      upiId: [''],
      active: [true],
      balance: [0, [ Validators.min(0)]],
      scannerName:[''],
      qrLink1: [''],
      qrLink2: [''],
      branchName: [''],
    });
  }

  onBankSubmit(): void {
   
    if (this.bankFormGroup.valid) {
      this.loader=true;
      console.log(this.bankFormGroup.value);
      const bankDetails = this.bankFormGroup.value;
      
      this.bank.createBank(bankDetails).subscribe(response => {
        this.snackbarService.snackbar('Account created successfully!', 'success');
        console.log('Account created successfully!', response);
        this.loader= false;
        this.resetForm()
      }, error => {
        this.snackbarService.snackbar('failed!', 'error');
        this.resetForm()
        this.loader= false;
        console.error('Error creating account:', error);
        confirm(error.error.message);
      });
    }
    }
  
    resetForm() {
      this.bankFormGroup .reset(); // Reset form values
      this.bankFormGroup .markAsPristine(); // Mark form as pristine
      this.bankFormGroup .markAsUntouched(); // Mark form as untouched
      Object.values(this.bankFormGroup .controls).forEach((control) => {
        control.setErrors(null); // Reset validation errors for each control
      });
    }

}
