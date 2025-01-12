import { Component, Inject } from '@angular/core';
import { Operation } from '../../domain/operation';
import { SnackbarService } from '../../services/snackbar.service';
import { ReportService } from '../../services/report.service';
import { RetryService } from '../../services/retry.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  prograsbar: boolean = false;
  operations: Operation[] ;
  operation:string;
  operator:number;
  displayedColumns: string[] ;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  private retryserv : RetryService ,
  private snackbarService:SnackbarService,
  private report: ReportService,
) { 
    this.operator = data.userId;
    this.operations=data.operation;
    this.operation=data.initialData;

    // this.displayedColumns();

    console.log(this.operations);
  }

}
