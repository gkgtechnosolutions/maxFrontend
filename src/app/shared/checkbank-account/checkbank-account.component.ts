import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SlotService } from '../../services/slot.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-checkbank-account',
  templateUrl: './checkbank-account.component.html',
  styleUrl: './checkbank-account.component.scss'
})
export class CheckbankAccountComponent {
  bankForm: FormGroup;
  bankList: any[] = [];
  displayedColumns: string[] = ['bankName', 'holderName' ];
loader: boolean ;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<CheckbankAccountComponent>,
    private slotService: SlotService,
    private snackbarService: SnackbarService ,
  ) {
    this.bankForm = this.fb.group({
      time: [''],
      amount: ['']
    });
  }

  onGetBanks() {
    if (this.bankForm.valid) {
      
      const newRange = this.bankForm.value;
      this.loader=true;
      // need change according to the 
      this.slotService.CheckBankAccount(newRange).subscribe(response => {
        this.snackbarService.snackbar(`  successfully `, 'success');
        console.log('AmountRange added successfully', response);
        this.bankList=response;
        this.loader=false;

      }, error => {
        this.snackbarService.snackbar('failed!', 'error');
        console.error('Error adding AmountRange', error);
        this.loader=false;
      });
    }
  }

}
