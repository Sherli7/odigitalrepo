import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NodeService } from '../../service/node.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CustumSnackbarService } from '../../custom-snackbar/custum-snackbar.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {
  messagerror!: string;
  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    public dialogRef: MatDialogRef<SnackbarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private node:NodeService,

    public _snackbar:CustumSnackbarService
  ) {}

  onNoPermit(): void {
    this.dialogRef.close();
  }

  permitDelete() {
    this.node.deleteNode(this.data.arg0).subscribe({
      next: (del: any) => {
        this.messagerror = this.data.arg1 + ' supprimé avec succès!';
        this._snackbar.openInfoSnakbar(this.messagerror,'Okay');
        this.dialogRef.close('deleted');
      },
      error: (error: any) => {
        let errorMessage = 'Une erreur s\'est produite lors de la suppression de ' + this.data.arg1;
        // Vous pouvez ici personnaliser le message en fonction du code d'erreur
        if (error.error && error.error.error) {
          switch (error.error.error.statusCode) {
            case 401:
              errorMessage = 'Vous n\'êtes pas autorisé à supprimer ' + this.data.arg1;
              break;
            case 403:
              errorMessage = 'Accès refusé pour supprimer ' + this.data.arg1;
              break;
            case 404:
              errorMessage = this.data.arg1 + ' n\'existe pas.';
              break;
            case 409:
              errorMessage = this.data.arg1 + ' est verrouillé et ne peut pas être supprimé.';
              break;
            // Ajoutez d'autres cas si nécessaire
          }
        }
  
        this.messagerror = errorMessage;
        this._snackbar.openInfoSnakbar(this.messagerror,"Try again!"); 
        this.dialogRef.close();
      }
    });
  }

}
