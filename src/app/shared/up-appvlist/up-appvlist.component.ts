import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-up-appvlist',
  templateUrl: './up-appvlist.component.html',
  styleUrl: './up-appvlist.component.scss'
})

export class UpAppvlistComponent {
  dataSource: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,){
    this.dataSource = data.obj;
  }
  displayedColumns: string[] = ['demo-position', 'Username', 'Amount', 'Time'];
  // dataSource = ELEMENT_DATA;

}




