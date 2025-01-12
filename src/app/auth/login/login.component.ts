import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loader: boolean = false;
  decodedToken: any;
  constructor(
    public auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loader = true;
      this.auth.loginUser(this.loginForm.value).subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          this.snackbarService.snackbar('Login successful', 'success');
          this.loader = false;
  
          // Save the token to localStorage
        
  
          this.decryptJwtToken(response.token);
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          const userRole = userData.role_user || '';
          if(localStorage.getItem('token') != null){
          if (userRole != 'SUPERADMIN') {
            this.router.navigate(['/home']);
          }
          if (userRole === 'SUPERADMIN') {
            this.router.navigate(['/SA']);
          } }
        },
        (error) => {
          this.snackbarService.snackbar('Login Failed', 'error');
          this.loader = false;
        }
      );
    } else {
      // Handle form validation errors if needed
    }
  }
  
  decryptJwtToken(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(base64));
      this.decodedToken = decodedPayload;
      
      localStorage.setItem('user', JSON.stringify(this.decodedToken));
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
  }
}
