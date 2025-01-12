import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DWModalComponent } from '../home/dw-modal/dw-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) {}
  dialogRef: MatDialogRef<DWModalComponent>;
  openModal(textData: string): void {
    this.dialogRef = this.dialog.open(DWModalComponent, {
      width: '1000px',
      height: '80vh',
      data: { text: textData },
    });
  }
  closeModal(): void {
    this.dialogRef.close();
  }
}
