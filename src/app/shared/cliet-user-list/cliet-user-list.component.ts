import { Component, Inject } from '@angular/core';
import { ClientUser } from '../../domain/Buser';
import { TeluserService } from '../../services/teluser.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cliet-user-list',
  templateUrl: './cliet-user-list.component.html',
  styleUrl: './cliet-user-list.component.scss'
})
export class ClietUserListComponent {
  Id :number;
  loader: boolean ;
  clientList: ClientUser[];
  displayedColumns: string[] = ['srNo','userId', 'name','operation' ];


  constructor(
    private teluser :TeluserService ,
    private snackbarService: SnackbarService ,
    @Inject(MAT_DIALOG_DATA) public data,

  ){ 
    
     this.Id= data.id;
     this.onGetclient();
    }

  onGetclient() {
      
      this.loader=true;
      this.teluser.getClientById(this.Id).subscribe(response => {
        this.clientList=response;
        this.loader=false;

      }, error => {
        this.snackbarService.snackbar('failed!', 'error');
        
        this.loader=false;
      });
    }

    onDlinkClient(Id:number) {
      
      this.loader=true;
      this.teluser.deleteClent(Id).subscribe(response => {
        this.snackbarService.snackbar('Removed successfully!', 'success');
        this.onGetclient();
        this.loader=false;

      }, error => {
        this.snackbarService.snackbar('Error to Removed!', 'error');
        this.loader=false;
      });
    }
    

  }

