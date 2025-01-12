import { Component, Inject, SimpleChanges } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Operation, Operations } from '../../domain/operation';
import { RetryService } from '../../services/retry.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  prograsbar: boolean = false;
  operations: Operation[];
  operation: string;
  operator: number;
  displayedColumns: string[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private retryserv: RetryService,
    private snackbarService: SnackbarService,
    private report: ReportService
  ) {
    this.operator = data.userId;
    this.operations = data.operation;
    this.operation = data.initialData;

    this.updateDisplayedColumns();

    console.log(this.operations);
  }

  updateDisplayedColumns() {
    if (this.operation === 'Deposit') {
      this.displayedColumns = [
        'serialNumber',
        'userName',
        'status',
        'amount',
        'utr',
        'retry',
      ];
    } else if (this.operation === 'Update') {
      this.displayedColumns = [
        'serialNumber',
        'userName',
        'status',
        'updatedPassword',
        'retry',
      ];
    } else {
      this.displayedColumns = [
        'serialNumber',
        'userName',
        'status',
        'amount',
        'retry',
      ];
    }
  }

  retry(op: Operation) {
    this.prograsbar = true;
    this.retryserv.postRetry(op).subscribe((data) => {
      this.snackbarService.snackbar('success Retry', 'success');
      this.prograsbar = false;

      if (this.operation === 'Deposit') {
        this.report.getDepositeReport(this.operator).subscribe(
          (data) => {
            this.operations = data;
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        this.report.getWithdrawReport(this.operator).subscribe(
          (data) => {
            this.operation = data;
          },
          (error) => {
            console.error(error);
          }
        );
      }

      (error) => {
        confirm(error.error.message);
      };
    });
  }
}
