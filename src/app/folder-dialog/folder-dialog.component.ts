import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NodeService } from '../service/node.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-folder-dialog',
  templateUrl: './folder-dialog.component.html',
  styleUrl: './folder-dialog.component.scss'
})
export class FolderDialogComponent implements OnInit{
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  messagerror!: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private node:NodeService,private fb: FormBuilder,private _snackBar: MatSnackBar,
  private dialogRef: MatDialogRef<FolderDialogComponent>,){}
      
  myForm!: FormGroup;


  ngOnInit() {
    this.myForm = this.fb.group({
      name: [''],
    });
  }

  onSubmit() {
    
    const nodeData = {
      name: this.myForm.get('name')?.value,
      nodeType: localStorage.getItem('nodeType'),
      relativePath: localStorage.getItem('relativePath')
    };
    console.log(nodeData);
    this.node.createNode(nodeData).subscribe((response:any) => {
        this.messagerror='Node created';
         this.openSuccessSnackBar();
        this.dialogRef.close()
    }, (error:any) => {

      if(error.status==409)
      this.messagerror='This node already exists. Please choose another name';
      this.openFailureSnackBar();
    });
  }


  openSuccessSnackBar(){
    this._snackBar.open(this.messagerror, "OK", {
      duration: 3000,
      data:{name:this.messagerror},
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['green-snackbar', 'login-snackbar'],
     });
    }//Snackbar that opens with failure background
    openFailureSnackBar(){
      
      this._snackBar.open(this.messagerror, "Try again!", {
      duration: 3000,
      data:{name:this.messagerror},
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['red-snackbar','login-snackbar'],
      });
     }
}

  