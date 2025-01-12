import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,AbstractControl, } from '@angular/forms';
import { SiteService } from '../../services/site.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SITE } from '../../domain/Site';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdateSiteComponent } from '../../shared/update-site/update-site.component';
import { ComponettitleService } from '../../services/componenttitle.service';

@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrl: './add-site.component.scss'
})
export class AddSiteComponent {
  siteForm: FormGroup;
  loader=false;
  sites :SITE[] 
  ;
  siteCount :number=0;

  constructor(  private titleService : ComponettitleService,public dialog: MatDialog,private fb: FormBuilder, private siteService: SiteService , private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.titleService.changeTitle('Site');
    this.fetchSites();
    this.fetchtoatalCount();

    this.siteForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.loader =true;
    if (this.siteForm.valid) {
      this.siteService.addSite(this.siteForm.value).subscribe(response => {
        this.snackbarService.snackbar(`added site successfully with name ${this.siteForm.value.name} `, 'success');
        this.loader= false;
        this.ngOnInit;
      }, error => {
        this.snackbarService.snackbar('failed!', 'error');
        this.loader= false;
      });
    }
  }

  deleteSite(id) {
  
    const isConfirmed = confirm('Do you really want to delete site?');

    if (isConfirmed) {
      this.loader=true;

      this.siteService.deleteSite(id).subscribe(
        (data) => {
      
          this.snackbarService.snackbar('Success: Site deleted', 'success');
          this.loader=false;
         
        },
        (error) => {
          this.snackbarService.snackbar('failed to delete site!', 'error');
          this.loader=false;
        }
      );
    } else {
      // If the user cancels the confirmation, do nothing
      this.snackbarService.snackbar('Deletion canceled !', 'error');
      
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
        this.snackbarService.snackbar('Error fetching banks!', 'error');
        this.loader=false;
      }
    );
  }
  fetchtoatalCount(): void {
    this.siteService.getCountTotal().subscribe(
      data => {
        this.siteCount = data;
       
      },
      error => {
        this.snackbarService.snackbar('Error fetching banks!', 'error');
        
      }
    );
  }


  openUpdateSiteDialog(site: SITE): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
   
    dialogConfig.data = {
      siteId  : site.id,
      name: site.name, 
      url: site.url,
  };
    
    const dialogRef = this.dialog.open(UpdateSiteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
     
    });
  

}
}
