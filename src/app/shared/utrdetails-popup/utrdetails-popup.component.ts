import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { utrDeposit } from '../../domain/Deposite';
import { UtrService } from '../../services/utr.service';

@Component({
  selector: 'app-utrdetails-popup',
  templateUrl: './utrdetails-popup.component.html',
  styleUrl: './utrdetails-popup.component.scss'
})
export class UTRDetailsPopupComponent {
  constructor(private utrServr: UtrService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.getUtrDetails();
    }
  UtrDetails ;
  loader = false;

  ngOnInit() {
    console.log("ngetDetails");
  
      

      
 
  }

  getFormattedDate(timestamp: string): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      
    };
    return new Intl.DateTimeFormat(undefined, options).format(date);
}
   getUtrDetails(){
    this.loader=true;
    console.log("ngetDetails");

    this.utrServr.getCheckUtr(this.data.utrNumber).subscribe(responce=>{
      console.log(responce);
      this.loader=false;
      this.UtrDetails = responce;
      // console.log(this.UtrDetails);

    }
    );
    
   }

}
