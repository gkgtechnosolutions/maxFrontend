import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import Tesseract from 'tesseract.js';
import { DepositeWithdraw } from '../../domain/Deposite';
import { SITE } from '../../domain/Site';
import { SiteMaster } from '../../domain/SiteMaster';
import { OperationsService } from '../../services/operations.service';
import { SiteService } from '../../services/site.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from '../../services/modal.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtrService } from '../../services/utr.service';
import { Operation, Operations } from '../../domain/operation';
import { ReportService } from '../../services/report.service';
import { interval } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';
import { RetryService } from '../../services/retry.service';

@Component({
  selector: 'app-image-text-modal',
  templateUrl: './image-text-modal.component.html',
  styleUrl: './image-text-modal.component.scss',
})
export class ImageTextModalComponent {
  constructor(
    private snackbarService: SnackbarService,

    private modalService: ModalService,

    private retryserv: RetryService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  ngOnInit(): void {}

  getFilteredData(): string {
    return this.data.replace(/[^0-9\s]/g, '');
  }

  // =====================why? =====================
  closeModal(): void {
    this.modalService.closeModal();
  }
}
