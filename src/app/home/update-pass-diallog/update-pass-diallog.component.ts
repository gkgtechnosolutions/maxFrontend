import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepositeWithdraw } from '../../domain/Deposite';
import { SiteUser } from '../../domain/User';
import { SiteService } from '../../services/site.service';
import { OperationsService } from '../../services/operations.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../services/snackbar.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-pass-diallog',
  templateUrl: './update-pass-diallog.component.html',
  styleUrl: './update-pass-diallog.component.scss'
})
export class UpdatePassDiallogComponent {
  formGroup: FormGroup;
  ocrResult: string = '';
  imagePath: string = '';
  imageStatus: string = 'Select or drag UTR Image';
  loader: boolean = false;
  DeposteWithdraw: DepositeWithdraw;
  buttonName: string = 'Deposit';
  user: any = {};
  typingTimer: any;
  doneTypingInterval = 500;
  loader1 = false;
  loader2: boolean;
  updateUser: SiteUser;

  constructor(
    private site: SiteService,
    private fb: FormBuilder,
    private operation: OperationsService,
    private _snackBar: MatSnackBar,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    
  }
  @ViewChild('fileInput') fileInput: ElementRef;
  utrNumberImageFileName: '';
  prograsbar: boolean = false;
  pBarPecentage: number = 0;
  
  ngOnInit(): void {
    this.myFormValues();
  }
  

  myFormValues() {
    this.formGroup = this.fb.group({
      userId: [this.data, [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.min(0.01)]],
      id: [''],
    });
  }

  onSubmit() {

    console.log(JSON.stringify(this.formGroup.value));
    this.updateUser=this.formGroup.value;
    const userData = localStorage.getItem('user');

    if (userData) {
      this.user = JSON.parse(userData);
    } else {
    }
    const id = this.user.user_id;
    this.formGroup.patchValue({ id: id });
    this.prograsbar = true;
    this.increaseProgressBar();

    this.operation.updatePassword(this.formGroup.value).subscribe(
      (data) => {
        this.snackbarService.snackbar('Password Succesfully Updated', 'success');
        this.prograsbar = false;
        this.pBarPecentage = 0;
        this.resetForm();
      },
      (error) => {
        this.pBarPecentage = 0;
        this.prograsbar = false;
     
        confirm(error.error.message);
      }
    );
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
  resetForm() {
    this.formGroup.reset(); // Reset form values
    this.formGroup.markAsPristine(); // Mark form as pristine
    this.formGroup.markAsUntouched(); // Mark form as untouched
    Object.values(this.formGroup.controls).forEach((control) => {
      control.setErrors(null); // Reset validation errors for each control
    });
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

}
