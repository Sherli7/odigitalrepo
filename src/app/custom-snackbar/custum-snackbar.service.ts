import { Injectable } from '@angular/core';
import { CustomSnackbarComponent } from './custom-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CustumSnackbarService {

  constructor(
    private snackbar:MatSnackBar) { }

  openInfoSnakbar(message:string,action:string):void{
    this.snackbar.openFromComponent(CustomSnackbarComponent,{
      duration:124000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center", // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
      data:{ 
        message:message,
        action:action,
        snackbar:this.snackbar
      },
      panelClass:['success-snackbar']
    }
    )
  }
}
