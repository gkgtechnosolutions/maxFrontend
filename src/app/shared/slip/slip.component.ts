import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-slip',

  templateUrl: './slip.component.html',
  styleUrl: './slip.component.scss',
})
export class SlipComponent implements OnInit {
  slipType: any;
  slipData: any;
  tableVisibility: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.slipType = data.type;
    this.slipData = data.data;
    console.log(this.slipData);
  }
  ngOnInit(): void {
    if (this.slipType != 'Update') {
      this.tableVisibility = true;
    }
  }
  captureAndDownload() {
    const element = document.querySelector('.body') as HTMLElement; // Cast to HTMLElement
    if (element) {
      // Use html2canvas to capture the element
      html2canvas(element, { scrollY: -window.scrollY }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'slip.png'; // Set the default filename
        link.click(); // Trigger the download
      });
    }
  }
}
