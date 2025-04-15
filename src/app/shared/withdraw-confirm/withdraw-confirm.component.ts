import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Bank } from '../../domain/Bank';
import { BankingService } from '../../services/banking.service';
import { OperationsService } from '../../services/operations.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-withdraw-confirm',
  templateUrl: './withdraw-confirm.component.html',
  styleUrl: './withdraw-confirm.component.scss'
})
export class WithdrawConfirmComponent {
  banks: Bank[] = [];
  selectedBank: Bank ;
  withdrawId: any;
  formGroup: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<WithdrawConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private http: HttpClient,
    private BankingService: BankingService,
   private operation: OperationsService,
  ) {
    this.withdrawId = data.id;
    console.log('Withdraw ID:', this.withdrawId);
  }

  ngOnInit(): void {
    this.loadBanks();
    this.formGroup = new FormGroup({
      bankId: new FormControl(null, Validators.required),
    });
    
  }

  // Load banks from backend
  loadBanks(): void {
   
    this.BankingService.getAllAccountdata().subscribe(
      (data) => {
       
        this.banks = data.filter((account) => !account.freeze);
       console.log('Banks loaded:', this.banks);
      },
      (error) => {
        
        console.error('Error fetching banks', error);
      }
    );
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const withdrawalRequest = {
        withdrawId: this.withdrawId,
        bankId: this.formGroup.get('bankId').value,
        // Add other necessary fields
      };

    this.operation.withdrawConfirmation(this.withdrawId, this.formGroup.get('bankId').value).subscribe(
        (data) => {
          this.dialogRef.close({
            success: true,
            selectedBank: this.selectedBank,
         
          });
        },
        (error) => {
          console.error('Error submitting withdrawal:', error);
          this.dialogRef.close({
            success: false,
            error: error
          
        } )
        })
    }
      
    
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
}

