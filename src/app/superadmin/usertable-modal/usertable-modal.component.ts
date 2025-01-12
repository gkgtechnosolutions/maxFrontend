import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-usertable-modal',

  templateUrl: './usertable-modal.component.html',
  styleUrl: './usertable-modal.component.scss',
})
export class UsertableModalComponent {
  displayedColumns: string[] = ['srNo', 'username', 'role']; // Define your columns here
  serialNumber: number = 1;
  tableDataWithSerialNumbers: any[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data.tableData); // Access the table data passed from the parent
    // Add serial numbers to each row of the data
    this.tableDataWithSerialNumbers = data.tableData.map((item, index) => {
      return { ...item, srNo: index + 1 };
    });
  }
}
