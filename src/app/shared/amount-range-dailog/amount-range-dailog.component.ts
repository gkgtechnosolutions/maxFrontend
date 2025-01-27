import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankingService } from '../../services/banking.service';
import { SlotService } from '../../services/slot.service';
import { amountRange, Slot } from '../../domain/Bank';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-amount-range-dailog',
  templateUrl: './amount-range-dailog.component.html',
  styleUrl: './amount-range-dailog.component.scss'
})
export class AmountRangeDailogComponent {
  amountRangeForm: FormGroup;
  displayedColumns: string[] = ['minAmount', 'maxAmount', 'operation'];
  slots: Slot[] = [];
  amountRanges:amountRange[] = [];
  loader: boolean;

  constructor(private fb: FormBuilder, private http: HttpClient, private BankServ: BankingService,private slotService: SlotService,private snackbarService: SnackbarService ,
  ) {
    this.amountRangeForm = this.fb.group({
      minAmount: ['', Validators.required],
      maxAmount: ['', Validators.required]
    });
    this.loadAmountRanges();
  }

  onSubmit() {
    if (this.amountRangeForm.valid) {
      const newRange = this.amountRangeForm.value;

      this.loader= true;
      this.slotService.addAmountRange(newRange).subscribe(response => {
        this.snackbarService.snackbar(`AmountRange added successfully `, 'success');
        this.loader= false;
        console.log('AmountRange added successfully', response);
        this.loadAmountRanges();

      }, error => {
        console.error('Error adding AmountRange', error);
        this.loader= false;
      });
    }
  }
  

 
 
  loadAmountRanges(): void {
    this.loader = true;
    this.slotService.getAmountRanges().subscribe(data => {
      console.log(data);
      this.amountRanges = data.map(amountRange => ({ ...amountRange, isEditing: false }));
      console.log(this.amountRanges);
      this.loader = false;
    });
  }

  editSlot(amountRange :amountRange): void {
   
    amountRange.isEditing = true;
  }

  saveSlot(amountRange :amountRange): void {
   amountRange.isEditing = false;
   this.loader =true;
    this.slotService.updateAmountRange(amountRange).subscribe(response => {
      this.snackbarService.snackbar(`AmountRange updated successfully `, 'success');
      console.log('Slot updated successfully', response);
      this.loadAmountRanges();
      this.loader =true;

    }, error => {
      this.snackbarService.snackbar('Error updating slot', 'error');
      console.error('Error updating slot', error);
      this.loader =true;
    });
    console.log('Slot saved:',amountRange);
  }

  cancelEdit(slot: Slot): void {
    slot.isEditing = false;
    // Optionally, reset the slot values to their original state
  }

}
