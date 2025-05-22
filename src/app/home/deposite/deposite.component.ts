import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OperationsService } from '../../services/operations.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import Tesseract from 'tesseract.js';
import { DepositeWithdraw } from '../../domain/Deposite';
import { SiteService } from '../../services/site.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from '../../services/modal.service';
import { UtrService } from '../../services/utr.service';
import {
  Observable,
  Subscription,
  debounceTime,
  fromEvent,
  interval,
  map,
  of,
  startWith,
} from 'rxjs';
import { Operation, Operations } from '../../domain/operation';
import { ReportService } from '../../services/report.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { SnackbarService } from '../../services/snackbar.service';
import { RetryService } from '../../services/retry.service';
import { ComponettitleService } from '../../services/componenttitle.service';
import { BankingService } from '../../services/banking.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { UTRDetailsPopupComponent } from '../../shared/utrdetails-popup/utrdetails-popup.component';
import { SlipComponent } from '../../shared/slip/slip.component';
import { Bank } from '../../domain/Bank';
import { DialogRef } from '@angular/cdk/dialog';
import { ImageTextModalComponent } from '../image-text-modal/image-text-modal.component';

@Component({
  selector: 'app-deposite',
  templateUrl: './deposite.component.html',
  styleUrl: './deposite.component.scss',
})
export class DepositeComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;

  ocrResult: string = '';
  imagePath: string = '';
  imageStatus: string = 'Select or drag UTR Image';
  loader: boolean = false;
  imagetext: string;
  DeposteWithdraw: DepositeWithdraw;
  buttonName: string = 'Deposit';
  user: any = {};
  utrValue: string;
  @ViewChild('UTR') utrInput: ElementRef;
  inputSubscription: Subscription;
  typingTimer: any;
  doneTypingInterval = 500;
  loader1 = false;
  loader2: boolean;
  operations: Operation[] = Operations;
  displayedColumns: string[] = ['userName', 'amount', 'status', 'retry'];
  dataSource: Operation[] = [];
  private subscription: Subscription;
  banks: Bank[] = [];
  depositTypes: string[] = ['DEPOSIT', 'COMMISION', 'BONUS', 'RETURNBACK'];
  filteredBanks: Observable<any[]>;
  bankIdControl!: FormControl;

  constructor(
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
    private report: ReportService,
    private site: SiteService,
    private fb: FormBuilder,
    private operation: OperationsService,

    private modalService: ModalService,
    private utrservice: UtrService,
    private retryserv: RetryService,
    private titleService: ComponettitleService,
    private BankingService: BankingService
  ) {}
  @ViewChild('fileInput') fileInput: ElementRef;
  utrNumberImageFileName: '';
  Operator: number;
  prograsbar: boolean = false;
  pBarPecentage: number = 0;
  ngOnInit(): void {
    this.titleService.changeTitle('Add Deposit');
    this.myFormValues();
    this.getuserID();
    this.getDeposite();
    this.subscription = interval(1000).subscribe(() => {
      this.getDeposite();
    });
  }
  ngOnDestroy() {
    // Unsubscribe from the interval observable when the component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getDeposite() {
    this.report.getDepositeReport(this.Operator).subscribe(
      (data) => {
        // this.dataSource=this.operations;
        this.dataSource = data;
        this.operations = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  

  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  myFormValues() {
    this.formGroup = new FormGroup({
      utrNumber: new FormControl('', [
        Validators.required,
        // Validators.maxLength(12),
      ]),
      userId: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      amount: new FormControl('', [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern('^[0-9]+(.[0-9]+)?$'),
      ]),
      bankId: new FormControl('', [Validators.required]),
      id: new FormControl(''),
      date: new FormControl(),
      depositType: new FormControl('DEPOSIT', Validators.required),
    });

    this.bankIdControl = this.formGroup.get('bankId') as FormControl;

    this.formGroup.get('userId').valueChanges.subscribe((value: string) => {
      // Convert v alue to lowercase and assign it back to the FormControl
      this.formGroup
        .get('userId')
        .setValue(value.toLowerCase(), { emitEvent: false });
    });

    this.formGroup
      .get('depositType')
      .valueChanges.subscribe((value: string) => {
        if (value !== 'DEPOSIT') {
          this.formGroup.get('utrNumber').setValue('NA');
          this.formGroup.get('bankId').setValue(0);
          // this.formGroup.get('utrNumber').disable(); // Disable the utrNumber control
        } else {
          this.formGroup.get('utrNumber').setValue(''); // Clear the value
          // this.formGroup.get('utrNumber').enable(); // Enable the utrNumber control
        }
      });

    this.filteredBanks = this.formGroup.controls['bankId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filterBanks(value || ''))
    );
    this.fetchBanks();
  }

  fetchBanks(): void {
    this.BankingService.getAllAccountdata().subscribe(
      (data) => {
        this.banks = data.filter((account) => !account.freeze);
      },
      (error) => {
        console.error('Error fetching banks', error);
      }
    );
  }
  // ===========================================================
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.formGroup.value.amount > 0) {
      this.onSubmit(event);
    }
  }
  // ===========================================================
  get utrNumber() {
    return this.formGroup.get('utrNumber');
  }
  onFileSelected(event: any) {
    this.loader = true;

    const file: File = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      this.recognizeText(imageUrl);
    } else {
      this.loader = false;
    }
  }
  async recognizeText(url: string) {
    try {
      let fetchingText = 'UTR Fetching';
      const intervalId = setInterval(() => {
        fetchingText += '.';
        if (fetchingText.length > 15) {
          fetchingText = 'UTR Fetching';
        }
        this.imageStatus = fetchingText;
        console.log(fetchingText);
      }, 500);

      const imageUrl = new URL(url);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const result = await Tesseract.recognize(blob);
      console.log(result.data.text);
      this.imagetext = result.data.text;
      const transactionID = this.extractTransactionID(result.data.text);
      // Extracting the amount

      // let amountRegex = /(\d{1,3},)?\d{1,3},\d{3}/; // Regex to match numbers with commas (e.g., 4,000)
      // let match = result.data.text.match(amountRegex);
      // let amount = match ? parseFloat(match[0].replace(/,/g, '')) : null;

      // if (amount) {
      //   this.formGroup.patchValue({
      //     amount: amount,
      //   });
      // } else {
      //   this.formGroup.patchValue({
      //     amount: '',
      //   });
      // }

      //===================================================================
      const bankNameRegex = /To\s([a-zA-Z\s]+)\n/; // Regex to match text after "To" until the end of the line
      const bankMatch = result.data.text.match(bankNameRegex);
      const bankName = bankMatch ? bankMatch[1].trim() : null;

      console.log(bankName);

      // if (bankName) {
      //   const normalizedBankName = bankName.replace(/\s+/g, '').toLowerCase();
      //   const matchedBankAccount = this.banks.find((account) =>
      //     account.bankName
      //       .replace(/\s+/g, '')
      //       .toLowerCase()
      //       .startsWith(normalizedBankName)
      //   );
      //   console.log(matchedBankAccount);
      //   if (matchedBankAccount) {
      //     this.formGroup.patchValue({
      //       bankId: matchedBankAccount.id,
      //     });
      //   } else {
      //     this.formGroup.patchValue({
      //       bankId: '',
      //     });
      //   }
      // } else {
      //   this.formGroup.patchValue({
      //     bankId: '',
      //   });
      // }

      clearInterval(intervalId); // Clear interval when operation completes

      if (transactionID) {
        this.formGroup.patchValue({
          utrNumber: transactionID,
        });
        this.onUTRInput(transactionID);

        this.imageStatus = 'UTR Fetched Successfully';
      } else {
        this.formGroup.patchValue({
          utrNumber: ' ',
        });
        this.imageStatus = 'UTR Failed';
      }

      this.loader = false;
    } catch (error) {
      console.error('Error recognizing text:', error);
    }
  }
  //==Time zone
  getLocalDateTime() {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDateTime = new Date().toLocaleString('en-US', {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    // Convert to the desired format (YYYY-MM-DD hh:mm:ss A)
    const [date, time, period] = localDateTime.split(/, | /);
    const [month, day, year] = date.split('/');
    const formattedDateTime = `${year}-${month}-${day} ${time} ${period}`;

    return formattedDateTime;
  }

  //====
  onSubmit(event: Event) {
    event.preventDefault();

    //===========================
    const enteredBankName = this.formGroup.get('bankId').value;

    // Find the bank in the banksList by bankName
    const selectedBank = this.banks.find(
      (bank) => bank.accountHolder === enteredBankName
    );

    if (selectedBank) {
      // Set the formControl's value to the bank's ID
      this.formGroup.get('bankId').setValue(selectedBank.id);
    } else {
      // Handle case where no matching bank was found
      console.log('Bank not found!');
    }
    //===========================
    const userData = localStorage.getItem('user');
    const currentDate = this.getLocalDateTime(); // probleam
    this.formGroup.patchValue({ date: currentDate });

    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      // Handle the case when user data is not available
      console.error('User data not found in localStorage');
      return;
    }
    const id = this.user.user_id;

    if (this.formGroup.valid) {
      // const isConfirmed = confirm(
      //   `Do you want to add amount ${this.formGroup.value.amount} to user ID ${this.formGroup.value.userId}?`
      // );
      const amount = this.formGroup.value.amount;
      const userId = this.formGroup.value.userId;
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: { amount, userId },
      });
      dialogRef.afterClosed().subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.prograsbar = true;
          this.formGroup.patchValue({ id: id });
          // double snackbar issue
          // this.snackbarService.snackbar('Deposite Request Received', 'success');

          this.increaseProgressBar();
          this.operation.deposite(this.formGroup.value).subscribe(
            (data) => {
              this.getDeposite();

              this.snackbarService.snackbar(
                'Deposite Request Received',
                'success'
              );

              this.prograsbar = false;
              this.pBarPecentage = 0;
              this.resetForm();
            },
            (error) => {
              console.error(error);
              this.prograsbar = false;
              this.pBarPecentage = 0;
              confirm(error.error.message);
            }
          );
        }
      });
    }
  }

  increaseProgressBar() {
    const incrementValue = 1;
    const totalTime = 18000;
    const intervalTime = totalTime / (100 / incrementValue);

    const interval = setInterval(() => {
      this.pBarPecentage += incrementValue;
      if (this.pBarPecentage >= 100) {
        clearInterval(interval);
      }
    }, intervalTime);
    this.pBarPecentage = 0;
  }

  // extractTransactionID(details: string) {

  //   let idMatch = details.match(/UPI transaction ID\s+(\d+)/);
  //   if (idMatch) {
  //   } else {

  //     idMatch = details.match(/\b\d{12}\b/);

  //     return idMatch ? idMatch[0] : null;
  //   }
  //   //IF===============
  //   const pattern = /(\d{6})\s(\d{6})/;
  //   const match = details.match(pattern);
  //   console.log("match");
  //   console.log(match);
  //   if (match) {
  //       return match[1] + match[2];
  //   }

  //   return idMatch ? idMatch[1] : null;
  // }

  extractTransactionID(details: string) {
    // Try to match UPI transaction ID first
    let idMatch = details.match(/UPI transaction ID\s+(\d+)/);
    if (idMatch) {
      return idMatch[1];
    }
    // Try to match a 12-digit number if UPI transaction ID was not found
    else if ((idMatch = details.match(/\b\d{12}\b/))) {
      return idMatch[0];
    }
    // Try to match two sets of six digits separated by a space
    else if ((idMatch = details.match(/(\d{7})\s(\d{5})/))) {
      return idMatch[1] + idMatch[2];
    }

    // Return null if no patterns matched
    return null;
  }

  closeModal(): void {
    this.modalService.closeModal();
  }

  public onFilesChange(files: any) {
    for (const droppedFile of files) {
      // Check if the dropped file is a file
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Handle the dropped file here
        });
      }
    }
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      // Handle dropped files
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList) {
    // Process dropped files

    if (files && files.length > 0) {
      // Call onFileSelected function with the first file from the FileList
      this.onFileSelected({ target: { files: [files[0]] } });
    }
  }
  resetForm() {
    this.formGroup.reset(); // Reset form values
    this.formGroup.markAsPristine(); // Mark form as pristine
    this.formGroup.markAsUntouched(); // Mark form as untouched
    Object.values(this.formGroup.controls).forEach((control) => {
      control.setErrors(null); // Reset validation errors for each control
    });
    this.bankIdControl.setValue('');
    this.filteredBanks = of(this.banks);
    this.filteredBanks = this.formGroup.controls['bankId'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filterBanks(value || ''))
    );
    this.fetchBanks();
  }
  onUTRInput(utrValue: string) {
    this.loader2 = true;
    if (utrValue.length > 0) {
      this.utrservice.checkUtr(utrValue).subscribe(
        () => {
          // Success
          this.loader2 = false;
          this.formGroup.get('utrNumber').setErrors(null);
        },
        (error) => {
          this.loader2 = false;
          this.formGroup.get('utrNumber').setErrors({ utrExists: true });
        }
      );
    }
  }

  onInput(event: any) {
    const inputElement: HTMLInputElement = event.target;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.onUTRInput(inputElement.value);
    }, this.doneTypingInterval);
  }
  onUserInput(event: any) {
    const inputElement: HTMLInputElement = event.target;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.checkUser(inputElement.value);
    }, this.doneTypingInterval);
  }
  checkUser(username: string) {
    this.loader1 = true;
    this.operation.checkUser(username).subscribe(
      () => {
        this.formGroup.get('userId').setErrors({ userExists: true });
        this.loader1 = false;
      },
      (error) => {
        this.formGroup.get('userId').setErrors(null);

        this.loader1 = false;
      }
    );
  }
  getuserID() {
    const userString = localStorage.getItem('user');
    if (userString) {
      // Step 2: Access user_role attribute
      const user = JSON.parse(userString);
      this.Operator = user.user_id;
    }
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '80%';
    // dialogConfig.data = this.operations;
    dialogConfig.data = {
      userId: this.Operator,
      initialData: 'Deposit',
      operation: this.operations,
    };

    console.log('in dialog');
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  retry(op: Operation) {
    this.prograsbar = true;
    this.retryserv.postRetry(op).subscribe((data) => {
      this.snackbarService.snackbar('success Retry', 'success'); 
      this.getDeposite();
      this.prograsbar = false;
      (error) => {
        confirm(error.error.message);
      };
    });
  }

  deleteReport(id: number) {
    // Show a confirmation dialog
    const isConfirmed = confirm('Do you really want to delete this report?');

    if (isConfirmed) {
      this.prograsbar = true;

      this.retryserv.deleteReport(id).subscribe(
        (data) => {
          this.snackbarService.snackbar('Success: Report deleted', 'success');
          this.getDeposite();
          this.prograsbar = false;
        },
        (error) => {
          console.log(error);
          this.prograsbar = false;
        }
      );
    } else {
      // If the user cancels the confirmation, do nothing
      console.log('Deletion canceled by the user.');
    }
  }
  openUTRDetailsPopup(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    // dialogConfig.data = this.operations;
    dialogConfig.data = { utrNumber: this.formGroup.get('utrNumber')?.value };

    console.log('in dialog');
    const dialogRef = this.dialog.open(UTRDetailsPopupComponent, dialogConfig);
  }
  //====================slip======
  openDepositDialog(element): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '52%';
    dialogConfig.data = {
      type: 'DEPOSIT',
      data: element,
    };
    const dialogRef = this.dialog.open(SlipComponent, dialogConfig);
  }
  private _filterBanks(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.banks.filter((bank) =>
      bank.accountHolder.toLowerCase().includes(filterValue)
    );
  }
  openDialogText() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    // dialogConfig.data = this.operations;
    dialogConfig.data = this.imagetext;

    console.log('in dialog');
    const dialogRef = this.dialog.open(ImageTextModalComponent, dialogConfig);
  }
}
