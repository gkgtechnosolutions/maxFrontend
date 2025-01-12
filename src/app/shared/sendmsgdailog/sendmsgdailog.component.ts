import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TeluserService } from '../../services/teluser.service';

@Component({
  selector: 'app-sendmsgdailog',
  templateUrl: './sendmsgdailog.component.html',
  styleUrl: './sendmsgdailog.component.scss'
})
export class SendmsgdailogComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private tel : TeluserService,
    private dialogRef: MatDialogRef<SendmsgdailogComponent>
  ) {
    this.uploadForm = this.fb.group({
      message: ['', Validators.required],
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('message', this.uploadForm.value.message);

      this.tel.sendFormData(formData).subscribe(
        (response) => {
          console.log('Message sent successfully:', response);
          this.dialogRef.close(response); // Close the dialog with the response
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
      // Pass the form data back to the parent component
      this.dialogRef.close(formData);
    }
  }
}
