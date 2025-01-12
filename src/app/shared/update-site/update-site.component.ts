import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BankingService } from '../../services/banking.service';
import { SiteService } from '../../services/site.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-update-site',
  templateUrl: './update-site.component.html',
  styleUrl: './update-site.component.scss'
})
export class UpdateSiteComponent {
  siteForm: FormGroup;
  loader = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateSiteComponent>,
    private Siteservice: SiteService,
    private snackbarService:SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.siteForm = this.fb.group({
      
      name: ['', Validators.required],
      url: ['', [Validators.required]]
    });
    this.siteForm.patchValue(this.data);
  }

  onSubmit(): void {
    if (this.siteForm.valid) {
      const updatedSiteDetails = this.siteForm.getRawValue();
      this.Siteservice.updateSite(updatedSiteDetails,this.data.siteId).subscribe(
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
      this.dialogRef.close(updatedSiteDetails);
    }
  }

}
