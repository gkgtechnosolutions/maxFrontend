import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BankingService } from '../../services/banking.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-botbankingupdate',
  templateUrl: './botbankingupdate.component.html',
  styleUrl: './botbankingupdate.component.scss'
})
export class BotbankingupdateComponent {
  bankForm: FormGroup;
  banksList ;
  loader: boolean;

  constructor(private fb: FormBuilder,
              private bankAccountService: BankingService ,
              private snackbarService:SnackbarService,) 
    {
    this.getAllBankAccounts();
  }

  ngOnInit(): void {
    this.bankForm = this.fb.group({
      id: [''],
      bankHolderName: [''],
      bankName: [''],
      accountNumber: [''],
      gpayUPI: [''],
      phonePeUPI: [''],
      upiId: [''],
      active: [true],
      balance: [0, [Validators.min(0)]],
      scannerName: [''],
      qrLink1: [''],
      qrLink2: [''],
   
    });
  }
  

  getAllBankAccounts() {
    this.loader = true;
    this.bankAccountService.getAllBotAccountdata().subscribe(
      (data) => {
        console.log(data);
        this.banksList = data;
        this.loader = false;
      },
      (error) => {
        console.error('Error fetching bank accounts:', error);
        this.loader = false;
      }
    );
  }
  resetForm() {
    this.bankForm.reset(); // Reset form values
    this.bankForm.markAsPristine(); // Mark form as pristine
    this.bankForm.markAsUntouched(); // Mark form as untouched
    this.getAllBankAccounts();
  }
  onSelectBank(bankId: number) {
    const selectedBank = this.banksList.find(bank => bank.id === bankId);
    if (selectedBank) {
      this.bankForm.patchValue(selectedBank);
    }
  }

  onUpdateBank() {
    if (this.bankForm.valid) {
      this.loader = true;
      const updatedDetails = this.bankForm.getRawValue(); // Get the value of disabled fields too
      this.bankAccountService.bankUpdate(updatedDetails,updatedDetails.id).subscribe(
        (response) => {
          this.snackbarService.snackbar('Bank details updated successfully!', 'success');
          console.log('Bank details updated successfully:', response);
          this.loader = false;
          this.resetForm();
        },
        (error) => {
          this.snackbarService.snackbar('Error updating bank details!', 'error');
          console.error('Error updating bank details:', error);
          this.loader = false;
          this.resetForm();
        }
      );
    }
  }
}
