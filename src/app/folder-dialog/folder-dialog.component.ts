import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NodeService } from '../service/node.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  isUpdateMode: boolean = false;
  updateNode:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private node:NodeService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FolderDialogComponent>){
      this.myForm = this.fb.group({
        name: ['', Validators.required],
        title: [''],
        description: ['']
      });
    }
      
  myForm!: FormGroup;

  cancel() {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (this.data && this.data.node) {
      this.isUpdateMode = true;
      this.myForm.patchValue({
        name: this.data.node.name,
        title: this.data.node.title,
        description: this.data.node.description
      });
    }
    this.getCurrentNode();
  }

  getCurrentNode(){
    this.node.getCurrentNode(this.data.node.entry.id).subscribe((res:any)=>{
      this.updateNode=res;
      console.log(this.updateNode);
    })
  }

  onSubmit() {
    let nodeData = {
      'name': this.myForm.get('name')?.value,
      'properties':{
        'cm:title': this.myForm.get('title')?.value,
        'cm:description': this.myForm.get('description')?.value,
      },
      'nodeType': this.updateNode.entry.nodeType
    };
  
    // Vérifiez si nous sommes en mode mise à jour ou en mode création
    let currentNodeId = localStorage.getItem('currentNodeId');
    if (currentNodeId) {
      // Mode mise à jour
      this.node.updateNode(currentNodeId, nodeData).subscribe({
        next: (response: any) => {
          this.messagerror = `${nodeData.name} mis à jour avec succès.`;
          this.openSuccessSnackBar();
          this.dialogRef.close({ event: 'updated', data: response });
        },
        error: (error: any) => {
          this.handleError(error);
        }
      });
    } else {
      // Mode création
      this.node.createNode(currentNodeId,nodeData).subscribe({
        next: (response: any) => {
          this.messagerror = `${nodeData.name} créé avec succès.`;
          this.openSuccessSnackBar();
          this.dialogRef.close({ event: 'created', data: response });
        },
        error: (error: any) => {
          this.handleError(error);
        }
      });
    }
  }
  
  handleError(error: any) {
    if (error.status === 409) {
      this.messagerror = 'Ce nœud existe déjà. Veuillez choisir un autre nom.';
    } else {
      // Gérer d'autres types d'erreurs ici
      this.messagerror = 'Une erreur est survenue. Veuillez réessayer.';
    }
    this.openFailureSnackBar();
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

  