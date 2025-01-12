import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    
    
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {

    var ua = window.navigator.userAgent;
    var edge = ua.indexOf("Edge");

    if(edge>0)
    {
      var blob = new Blob([buffer], {type: 'data:application/vnd.ms-excel'});
      //window.navigator.msSaveBlob(blob, fileName + EXCEL_EXTENSION);
    }
    else
    {
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      
      FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }
    
    //'_export_' + new Date().getTime()
  }

  public exportAsExcelFilewithelement(json: any, excelFileName: string): void {
    
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(json);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, excelFileName+".xlsx");

    // const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(json);
    // 
    // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    // this.saveAsExcelFile(excelBuffer, excelFileName);
  }
}
