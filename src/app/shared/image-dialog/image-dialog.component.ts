import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-image-dialog',
  template: `
    <div class="dialog-container">
      <img [src]="data.imageUrl" alt="Zoomed Image" class="zoomed-image">
    </div>
  `,
  styles: [`
    .dialog-container {
      text-align: center;
    }
    .zoomed-image {
      max-width: 100%;
      max-height: 100%;
    }
  `]
})
export class ImageDialogComponent {

 constructor(@Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }) {}

}
