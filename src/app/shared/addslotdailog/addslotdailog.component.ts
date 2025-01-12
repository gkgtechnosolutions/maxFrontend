import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Slot } from '../../domain/Bank';
import { BankingService } from '../../services/banking.service';
import { SlotService } from '../../services/slot.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-addslotdailog',
  templateUrl: './addslotdailog.component.html',
  styleUrl: './addslotdailog.component.scss'
})
export class AddslotdailogComponent {
  slotForm: FormGroup;
  displayedColumns: string[] = ['startTime', 'endTime', 'operation'];
  slots: Slot[] = [];
loader: boolean = false;;

  constructor(private fb: FormBuilder, private http: HttpClient, private BankServ: BankingService,private slotService: SlotService ,private snackbarService: SnackbarService ,
  ) {
    this.slotForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
    this.loadSlots();
  }

  onSubmit() {
    console.log('Form submitted', this.slotForm.value);
    if (this.slotForm.valid) {
      this.loader=true;
      const newSlot = this.slotForm.value;
      this.slotService.addSlot(newSlot).subscribe(response => {
        this.loader=false;
        this.snackbarService.snackbar(`Slot added successfully `, 'success');
        this.loadSlots();
        console.log('Slot added successfully', response);
        
      }, error => {
        this.loader=true;
        console.error('Error adding slot', error);
      });
    }
  }

 
 
  loadSlots(): void {
    this.loader=true;
    this.slotService.getSlots().subscribe(data => {
      this.slots = data.map(slot => ({ ...slot, isEditing: false }));
      this.loader=false;
    });
  }

  editSlot(slot: Slot): void {
    slot.isEditing = true;
    
  }

  saveSlot(slot: Slot): void {
    slot.isEditing = false;
    // Call the service to update the slot (you can implement this)
    this.slotService.updateSlot(slot).subscribe(data=> {
      
      console.log('Slot updated successfully', data);
      this.snackbarService.snackbar(`Slot updated successfully `, 'success');
      this.loadSlots();
    }, error => {
      console.error('Error updating slot', error);
    });
    console.log('Slot saved:', slot);
  }

  cancelEdit(slot: Slot): void {
    slot.isEditing = false;
    // Optionally, reset the slot values to their original state
  }
}
