import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { NodeService } from '../../service/node.service';
import { FolderDialogComponent } from '../folder-dialog.component';

@Component({
  selector: 'app-update-folder',
  templateUrl: './update-folder.component.html',
  styleUrl: './update-folder.component.scss'
})
export class UpdateFolderComponent {
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    messagerror!: string;
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
    showPreview = false;
  
    ngOnInit() {
      this.getCurrentNode();
    }
  
    getCurrentNode(){
      this.node.getCurrentNode(this.data.node.entry.id).subscribe((res:any)=>{
        this.updateNode=res;
        this.myForm.patchValue({
          name: this.updateNode.entry.name,
          properties:{
          title: this.updateNode.entry.properties.title,
          description: this.updateNode.entry.properties.description
          }
        });
      })
    }
  
    onSubmit() {
      let nodeData: any = {
        properties: {
          'cm:title': this.myForm.get('title')?.value,
          'cm:description': this.myForm.get('description')?.value,
        }
      };

      if (this.myForm.get('name')?.value !== this.updateNode.entry.name) {
        nodeData.name = this.myForm.get('name')?.value;
      }
      this.node.updateNode(this.data.node.entry.id, nodeData).subscribe({
        next: (response: any) => {
          this.messagerror = 'Mise à jour effectuée avec succès.';
          this.openSuccessSnackBar();
          this.dialogRef.close({ event: 'updated', data: response });
        },
        error: (error: any) => {
          this.handleError(error);
        }
      });
    }
    
    handleError(error: any) {
      if (error.status === 409) {
        this.messagerror = 'Ce nœud existe déjà. Veuillez choisir un autre nom.';
      } else {
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
      }
      //Snackbar that opens with failure background
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