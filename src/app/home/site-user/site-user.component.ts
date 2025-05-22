import { Component, ViewChild } from '@angular/core';
import { SiteService } from '../../services/site.service';
import { ComponettitleService } from '../../services/componenttitle.service';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SiteMastersService } from '../../services/site-masters.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SITE } from '../../domain/Site';
import { siteMaster } from '../../domain/SiteMaster';
import { SiteUser } from '../../domain/User';
import { SiteUserService } from '../../services/site-user.service';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-site-user',
  templateUrl: './site-user.component.html',
  styleUrl: './site-user.component.scss'
})
export class SiteUserComponent {
  siteMasterForm: FormGroup;
  typingTimer: any;
  doneTypingInterval = 500;
  loader=false;
  loader1 = false;
  siteMaters :siteMaster[] ;
  siteCount :number=0;
  sites:SITE[] ;
  siteMasterId: number;
  siteUsers:SiteUser[];
  siteUserId: any;
  totalUsers = 0;
  pageSize = 8;
  currentPage = 0;
  totalPages = 0;
  cumulativeCount = 0;
 

  // sites: { id: number, name: string }[] = [
  //   { id: 1, name: 'Site 1' },
  //   { id: 2, name: 'Site 2' },
   
  // ];
  // siteMasters = [
  //   { id: 1, name: 'Site 1', username: 'user1', password: 'pass1', transactionCode: 'trans1', dtoZuserId: 101, siteId: 1 },
  //   { id: 2, name: 'Site 2', username: 'user2', password: 'pass2', transactionCode: 'trans2', dtoZuserId: 102, siteId: 2 }
   
  // ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor( private siteService: SiteService, private titleService : ComponettitleService,public dialog: MatDialog,private fb: FormBuilder, private siteMasterService: SiteMastersService , private snackbarService: SnackbarService ,private siteUserService:SiteUserService) {}

  ngOnInit(): void {
    this.titleService.changeTitle('Site-Master');
    this.fetchSiteMasters();
    this.fetchSites();
    this.fetchSiteUsers();
    this.fetchUsers(this.currentPage, this.pageSize);
 

    this.siteMasterForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, this.passwordValidator]],
      name: ['', Validators.required],
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

  passwordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value: string = control.value;

    // Check if the value is null or undefined
    if (value == null) {
      return null;
    }

    // Perform password validation
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const minLength = value.length >= 8;

    // Check if all criteria are met
    if (hasUpperCase && hasLowerCase && hasNumber && minLength) {
      return null; // Return null if validation passes
    }

    // Return validation error object if any criteria fails
    return { invalidPassword: true };
  }

  onSiteMasterChange(event): void {
    const selectedSiteUser = event.value;
    console.log('onSiteMasterChange', selectedSiteUser);
    if(selectedSiteUser.id){
      this.siteUserId=selectedSiteUser.id;
    }
    this.siteMasterForm.patchValue({
      name: selectedSiteUser.name,
      password: selectedSiteUser.password,
      balance: selectedSiteUser.balance,
      creditReference: selectedSiteUser.creditReference,
      betStatus: selectedSiteUser.betStatus,
      activeStatus: selectedSiteUser.activeStatus,
      site_id: selectedSiteUser.site.id,
      zuserId: selectedSiteUser.zuserId,
      masterId: selectedSiteUser.masterId,
      date: selectedSiteUser.date,
      // userId:selectedSiteUser.userId,
    });
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
  fetchSites(): void {
    this.loader=true;
    this.siteService.getAllSitedata().subscribe(
      data => {
        this.sites = data;
        this.loader=false;
      },
      error => {
        console.error('Error fetching banks', error);
        this.loader=false;
      }
    );
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
        console.error('Error adding siteUser', error);
        this.loader= false;
      });
    }
  }

  // deleteSiteMaster(id) {
  
  //   const isConfirmed = confirm('Do you really want to SiteMaster?');

  //   if (isConfirmed) {
  //     this.loader=true;

  //     this.siteUserService.deleteSiteUsers(id).subscribe(
  //       (data) => {
  //         this.snackbarService.snackbar('Success: SiteMaster deleted', 'success');
  //         this.loader=false;
  //       },
  //       (error) => {
  //         console.log(error);
  //         this.loader=false;
  //       }
  //     );
  //   } else {
  //     // If the user cancels the confirmation, do nothing
  //     console.log('Deletion canceled by the user.');
  //   }

  // }


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

  fetchSiteUsers(): void {
    console.log('Fetching siteuser');
    // this.loader=true;
    this.siteUserService.getAllSiteUserdata(this.pageSize,this.currentPage).subscribe(
      data => {
        
        this.siteUsers = data.content;
        console.log('siteUsers', this.siteUsers);
        this.totalUsers = data.totalElements;
        this.totalPages = data.totalPages;
        this.cumulativeCount = (this.currentPage * this.pageSize);
        this.loader=false;
      },
      error => {
        console.error('Error fetching banks', error);
        this.loader=false;
      }
    );
  }

  


//   openUpdateSiteDialog(site: SITE): void {
//     const dialogConfig = new MatDialogConfig();
//     dialogConfig.width = '50%';
   
//     dialogConfig.data = {
//       siteId  : site.id,
//       name: site.name, 
//       url: site.url,
//   };
    
//     const dialogRef = this.dialog.open(UpdateSiteComponent, dialogConfig);
//     dialogRef.afterClosed().subscribe((result) => {
     
//     });
  

// }

onUpdate(): void {
  this.loader =true;
  this.patchDtoZuserId();
  if (this.siteMasterForm.valid) {
    this.siteUserService.updateSiteUser(this.siteMasterForm.value).subscribe(response => {
      this.snackbarService.snackbar(`updated siteUser successfully with name ${this.siteMasterForm.value.name} `, 'success');
      console.log('SiteUser updated successfully', response);
      this.loader= false;
    }, error => {
      console.error('Error updated siteUser', error);
      this.loader= false;
    });
  }
}


//=================================paginator===============

fetchUsers(page: number, size: number) {
  const params = {
    page: page.toString(),
    size: size.toString(),
  };
}

onPageChange(event: PageEvent) {
  this.currentPage = event.pageIndex ;
  this.pageSize = event.pageSize;
  this.fetchSiteUsers();
  this.fetchUsers(this.currentPage, this.pageSize);
}

getSerialNumber(index: number): number {
  // Return the cumulative count plus the index within the current page
  return this.cumulativeCount + index + 1;
}

//===========userName========
checkUser(username: string) {
  this.loader1 = true;
  this.siteUserService.checkUser(username).subscribe(
    () => {
      this.siteMasterForm.get('userId').setErrors(null);
      this.loader1 = false;
    },
    (error) => {
      this.siteMasterForm.get('userId').setErrors({ userExists: true });

      this.loader1 = false;
    }
  );
}

onUserInput(event: any) {
  const inputElement: HTMLInputElement = event.target;
  clearTimeout(this.typingTimer);
  this.typingTimer = setTimeout(() => {
    this.checkUser(inputElement.value);
  }, this.doneTypingInterval);
}



}
