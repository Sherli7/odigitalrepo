import { Component, Inject, AfterViewInit,ChangeDetectorRef,OnInit, EventEmitter, Output} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, finalize } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { NodeService } from '../../service/node.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-upload-popup',
  templateUrl: './upload-popup.component.html',
  styleUrl: './upload-popup.component.scss'
})
export class UploadPopupComponent implements OnInit,AfterViewInit {
  @Output() uploadCompleted = new EventEmitter<boolean>();
  importdata: any;
  closeMessage = 'closed';
  nodeTypes: any;
  metaNode: any;
  selectedNodeType: string = '';
  level1: any;
  level2: any;
  formFix: any;
  prefix: any;
  suffix: any;
  myform: FormGroup = this.buildr.group({
    "nodeType": this.buildr.control('', [Validators.required]),
    "cm:name": this.buildr.control('', [Validators.required]),
    "cm:title": this.buildr.control(''),
    "dateField": ['', Validators.required],
  });
  file!: File;
  filename: any;
  size: any;
  unit!: string;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  textName = '';
  uploadFiles?: File;

  messagerror: any;
  durationInSeconds: number=5;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  metadataFields: any;
  constructor(
    private ref: MatDialogRef<UploadPopupComponent>,
    private node: NodeService,
    private _snackBar: MatSnackBar,
    private buildr: FormBuilder,
    private formBuilder:FormBuilder,
    private cdRef: ChangeDetectorRef  // Ajoutez le ChangeDetectorRef ici
  ) {}


ngOnInit() {
    this.node.getNodeTypeDefinition().subscribe((s: any) => {
      this.nodeTypes = s.filter((node: any) => node.name.startsWith('obiv'));
    },);
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.filename = this.currentFile.name;
    } else {
      this.filename = 'Select File';
    }
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }    
  
  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!d) return true;
    return d <= today;
  };
  
  

  upload(): void {
    this.progress = 0;
    this.message = '';
    const formData = new FormData();

    // Ajout des champs de formulaire
    Object.keys(this.myform.controls).forEach((controlName) => {
      let fieldValue = this.myform.get(controlName)?.value;
      if (fieldValue instanceof Date) {
        fieldValue = this.formatDate(fieldValue);
      }
      formData.append(controlName, fieldValue);
    });

    // Ajout du fichier
    if (this.currentFile) {
      formData.append("filedata", this.currentFile);
      this.node.uploadFile(formData).pipe(
        finalize(() => this.ref.close('success')) // Ferme le dialogue après l'achèvement de l'opération
      ).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
            this.ref.close('deleted');
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.openSuccessSnackBar();
            // Dans UploadPopupComponent
            //this.uploadCompleted.emit(true); // Après un téléchargement réussi
            this.uploadCompleted.emit(true); // Émission de l'event en cas de succès
          } 
        },
        error: (err: any) => {
          this.progress = 0;
          this.message = err.error?.message || 'Could not upload the file !';
          this.openFailureSnackBar();
          this.uploadCompleted.emit(false); // Émission de l'event même en cas d'échec
          this.currentFile = undefined;
        }
      });
    }
  }
  

  // Fonction pour obtenir l'extension du fichier
  getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return ''; // Aucune extension trouvée
    }
    return filename.slice(lastDotIndex);
  }

  closepopup() {
    this.ref.close('Closed using function');
  }

  trouverPrefixeEtSuffixe(expression: string) {
    const separateur = ':';
    const indexSeparateur = expression.indexOf(separateur);

    if (indexSeparateur !== -1) {
      this.prefix = expression.slice(0, indexSeparateur);
      this.suffix = expression.slice(indexSeparateur + 1);

      return { prefix: this.prefix, suffix: this.suffix };
    } else {
      throw new Error('Le séparateur n\'a pas été trouvé dans l\'expression.');
    }
  }

  changeNodeType(nodeTypeName: string) {
    this.selectedNodeType = nodeTypeName;
    this.node.getNodeTypeDefinition().subscribe((response: any) => {
      const filteredNodes = response.filter((node: any) => node.name.startsWith(this.selectedNodeType));
      this.metadataFields = []; // Réinitialiser les champs de métadonnées
  
      filteredNodes.forEach((node:any) => {
        for (const key in node.properties) {
          const property = node.properties[key];
          if (property.name.startsWith('obiv')) {
            this.metadataFields.push(property); // Ajouter au tableau de champs
            console.log(this.metadataFields);
            const { prefix, suffix } = this.trouverPrefixeEtSuffixe(property.name);
            const controlName = `${prefix}:${suffix}`;
  
            if (!this.myform.get(controlName)) {
              this.myform.addControl(controlName, this.formBuilder.control(''));
            }
          }
        }
      });
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
