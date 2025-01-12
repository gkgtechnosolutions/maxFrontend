import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BankingService } from '../../services/banking.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-update-bank',
  templateUrl: './update-bank.component.html',
  styleUrl: './update-bank.component.scss'
})
export class UpdateBankComponent {
  bankAccountForm: FormGroup;
  bankAccounts: any[] = [];
  loader = false;
  selectedAccount;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private bankAccountService: BankingService ,
    private route: ActivatedRoute,
    private snackbarService:SnackbarService,
  ) {
    this.bankAccountForm = this.fb.group({
      accId: ['', Validators.required],
      bankName: ['', Validators.required],
      accountHolder: ['', Validators.required],
      // accId: [{ value: '', disabled: true }, Validators.required],
      ifscCode: ['', Validators.required],
      branchName: [''],
      balance: [0, [Validators.required, Validators.min(0)]],
      freeze: [false]
    });
  }

  ngOnInit() {
    this.getAllBankAccounts();
  }

  getAllBankAccounts() {
    this.loader = true;
    this.bankAccountService.getAllAccountdata
    ().subscribe(
      (data) => {
        this.bankAccounts = data;
        this.loader = false;
      },
      (error) => {
        console.error('Error fetching bank accounts:', error);
        this.loader = false;
      }
    );
  }

  onAccIdChange(accId: string) {
    this.selectedAccount = this.bankAccounts.find(account => account.accId === accId);
    if (this.selectedAccount) {
      // console.log(`selectedAccount: ${this.selectedAccount.id}`);
      this.bankAccountForm.patchValue(this.selectedAccount);
      
    } else {
      console.error('Account ID not found in the list');
    }
  }

  onSubmit() {
    if (this.bankAccountForm.valid) {
      this.loader = true;
      const updatedDetails = this.bankAccountForm.getRawValue(); // Get the value of disabled fields too
      this.bankAccountService.updateBankAccount(updatedDetails,this.selectedAccount.id).subscribe(
        (response) => {
          this.snackbarService.snackbar('Bank details updated successfully!', 'success');
          console.log('Bank details updated successfully:', response);
          this.loader = false;
        },
        (error) => {
          console.error('Error updating bank details:', error);
          this.loader = false;
        }
      );
    }
  }

}
