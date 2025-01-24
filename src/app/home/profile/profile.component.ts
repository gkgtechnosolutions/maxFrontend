import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { USER } from '../../domain/User';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  passwordForm: FormGroup;
  loader: boolean = false;
  decodedToken: any;
  Username: String = '';
  User: any = {};
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(
    public auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group(
      {
        oldPassword: ['', [Validators.required, Validators.minLength(5)]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);
    this.Username = user ? user.user_email : null;
  }

  
  onSubmit() {
    this.loader = true;
  
    const user: USER = {
      username: this.Username,
      password: this.passwordForm.value.oldPassword,
    };
    this.auth.updatePassword(user, this.passwordForm.value.password).subscribe(
      (data) => {
        this.snackbarService.snackbar('Password Succesfully Updated', 'success');
        // this._snackBar.open('Password Succesfully Updated', 'Close', {
        //   duration: 3000,
        //   horizontalPosition: 'center',
        //   verticalPosition: 'bottom',
        //   panelClass: ['success-snackbar'],
        // });
        Object.keys(this.passwordForm.controls).forEach((key) => {
          this.passwordForm.get(key)?.setErrors(null);
          this.passwordForm.get(key)?.markAsUntouched(); // Optionally mark controls as untouched
        });
        this.passwordForm.reset();
        this.loader = false;
      },
      (error) => {
      
        this.loader = false;
        confirm('Old password Not Correct');
      }
    );
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;

    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ passwordMismatch: true });
    } else {
      return null;
    }
  }
}
