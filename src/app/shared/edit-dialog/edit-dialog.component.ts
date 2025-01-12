import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApproveService } from '../../services/approve.service';
import { map, Observable, of } from 'rxjs';
import { BankingService } from '../../services/banking.service';
import { Bank } from '../../domain/Bank';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-edit-dialog',

  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {
  formGroup: FormGroup;
  bankIdControl!: FormControl;
  banksList: Bank[];
  filteredBanks: Observable<Bank[]>;
  


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any,
    private apprvservice : ApproveService,
    private bank:BankingService,
    public dialog: MatDialog,
    public snackbarService :SnackbarService,
  ) {
    // Create form and prefill it with user data
    this.formGroup = this.fb.group({
      utrNumber: [user.utrNumber],
      amount: [user.amount],
      bankId: [user.bank.bankName]
    });
    
    this.bankIdControl = this.formGroup.get('bankId') as FormControl;

    this.filteredBanks = this.formGroup.controls['bankId'].valueChanges.pipe(

      map(value => this._filterBanks(value || ''))
    );
    this.loadBanks();
  }

  onSave(): void {
    const enteredBankName = this.formGroup.get('bankId').value;
          console.log(enteredBankName);
    const selectedBank = this.banksList.find(bank => bank.bankName === enteredBankName);
    console.log(selectedBank +"selected");
    if (selectedBank) {
      // Set the formControl's value to the bank's ID
      this.formGroup.get('bankId').setValue(selectedBank.id);
  
      // Now proceed with form submission logic
      console.log('Form Submitted', this.formGroup.value);
    } else {
      // Handle case where no matching bank was found
      console.log('Bank not found!');
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {amount:null},
    });
    dialogRef.afterClosed().subscribe((isConfirmed) => {
      if (isConfirmed) {

    if (this.formGroup.valid) {
      const updatedData = this.formGroup.value;
      this.apprvservice.updateApproveDeposit(this.user.id, updatedData).subscribe({
        next: (response) => {
          console.log('Update successful', response);
          this.dialogRef.close(response);
           this.resetForm();
        },
        error: (error) => {
          this.snackbarService.snackbar('failed!', 'error');
          console.error('Update failed', error);
          this.resetForm();
          // Handle error if necessary
        }
      });
    }
  }
});
  }
  private loadBanks() {
    this.bank.getAllBankdata().subscribe((data) =>  {
      
      this.banksList = data;
         console.log(this.banksList);
        // this.formGroup.get('bankId').updateValueAndValidity() // Trigger valueChanges after banksList is loaded
    });
  }

  onBankSelected(bankId: number) {
    // If needed, you can retrieve the selected bank's full details
    const selectedBank = this.banksList.find(bank => bank.id === bankId);
    console.log("Selected Bank:", selectedBank);
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without any changes
  }

  resetForm() {
    this.formGroup.reset(); // Reset form values
    this.formGroup.markAsPristine(); // Mark form as pristine
    this.formGroup.markAsUntouched(); // Mark form as untouched
    Object.values(this.formGroup.controls).forEach((control) => {
      control.setErrors(null); // Reset validation errors for each control
    });
    this.bankIdControl.setValue('');
    this.filteredBanks = of(this.banksList);
    this.filteredBanks = this.formGroup.controls['bankId'].valueChanges.pipe(

      map(value => this._filterBanks(value || ''))
    );
    this.loadBanks();
  }

  private _filterBanks(value: string): any[] {
    console.log(value ,"in filter");
    const filterValue = value.toLowerCase();
    return this.banksList.filter(bank => bank.bankName.toLowerCase().includes(filterValue));
  }

}
