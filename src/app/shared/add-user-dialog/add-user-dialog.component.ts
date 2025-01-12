import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { siteMaster } from '../../domain/SiteMaster';
import { SITE } from '../../domain/Site';
import { SiteService } from '../../services/site.service';
import { SiteUserService } from '../../services/site-user.service';
import { SiteMastersService } from '../../services/site-masters.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.scss'
})
export class AddUserDialogComponent {
  addUserForm: FormGroup;
  siteMasterForm:FormGroup;
  siteMaters :siteMaster[] ;
  sites:SITE[] ;
  loader=false;
  
  constructor(
    private fb: FormBuilder,
    private siteService: SiteService,
    private siteMasterService: SiteMastersService , 
    private snackbarService: SnackbarService ,
    private siteUserService:SiteUserService,
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data passed from the parent component
  ) {}

  ngOnInit(): void {
    this.fetchSiteMasters();
    this.fetchSites();
  
    this.siteMasterForm = this.fb.group({
      userId: [this.data.userId, Validators.required],
      password: ['' ],
      name: ['',],
      balance: ['0'],
      creditReference: ['0'],
      site_id: ['', Validators.required],
      masterId: [''],
      betStatus: [false],
      activeStatus: [true],
      id: ['0'],
      zuserId: [''],
      date: [new Date()],
     
    });
    this.patchDtoZuserId();
  }
  patchDtoZuserId() {
    const userString = localStorage.getItem('user');
    if (userString) {
      // Step 2: Access user_role attribute
      const user = JSON.parse(userString);
      // console.log('in patchDtouserId', user.user_id);
      this.siteMasterForm.patchValue({
      
        zuserId: user.user_id // Replace 1234 with the actual value you want to set
      });
     
    }
  }
  
  onSubmit(): void {
    this.loader =true;
    // console.log('onSubmit', this.siteMasterForm.value);
    if (this.siteMasterForm.valid) {
      // console.log('onSubmit', this.siteMasterForm.value);
      this.siteUserService.addSiteUser(this.siteMasterForm.value).subscribe(response => {
        this.snackbarService.snackbar(`added siteUser successfully with name ${this.siteMasterForm.value.name} `, 'success');
        console.log('siteUser added successfully', response);
        this.loader= false;
      }, error => {
        this.snackbarService.snackbar('failed!', 'error');
        console.error('Error adding siteUser', error);
        this.loader= false;
      });
    }
  }

  fetchSites(): void {
   
    this.siteService.getAllSitedata().subscribe(
      data => {
        this.sites = data;
        
      },
      error => {
        console.error('Error fetching banks', error);
        
      }
    );
  }
  fetchSiteMasters(): void {
    console.log('Fetching siteMasters');
    // this.loader=true;
    this.siteMasterService.getAllSitedata().subscribe(
      data => {
        
        this.siteMaters = data;
        this.loader=false;
      },
      error => {
        console.error('Error fetching banks', error);
        this.loader=false;
      }
    );
  }


}
