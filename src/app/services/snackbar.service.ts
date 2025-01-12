import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }


  snackbar(text: string, snackbarType: string): void {
    let panelClass: string[] = [];
    switch (snackbarType) {
      case 'success':
        panelClass = ['success-snackbar'];
        break;
      case 'error':
        panelClass = ['error-snackbar'];
        break;
      // Add more cases for other types if needed
      default:
        break;
    }
    this.snackBar.open(text, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
    
      panelClass: panelClass
    });
  }

}
