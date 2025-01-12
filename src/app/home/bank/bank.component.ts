import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
import { BankingService } from '../../services/banking.service';
import { ComponettitleService } from '../../services/componenttitle.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.scss'
})
export class BankComponent implements OnInit {
  bankFormGroup: FormGroup;
  loader:boolean;

  constructor(private fb: FormBuilder,
    private snackbarService:SnackbarService,
    private bank:BankingService,
    private titleService: ComponettitleService,
  ) {
    this.titleService.changeTitle('Add Bank');
  }

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

  onBankSubmit(event: Event): void {
   
    if (this.bankFormGroup.valid) {
      this.loader=true;
      const bankDetails = this.bankFormGroup.value;
      
      this.bank.createBank(bankDetails).subscribe(response => {
        this.snackbarService.snackbar('Account created successfully!', 'success');
        console.log('Account created successfully!', response);
        this.loader= false;
        this.resetForm()
      }, error => {
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
