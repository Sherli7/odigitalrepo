import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NodeService } from '../service/node.service';
import { saveAs } from 'file-saver';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.scss']
})
export class VersionHistoryComponent implements OnInit {
  versions: any;
  displayedColumns: string[] = ['name', 'versionComment', 'modified', 'modifiedby', 'mimeTypeName', 'version', 'action'];
  selectedFile: File | null = null;
  majorVersion = false;
  comment = '';
  selectedFileName: string | null = null;
  messagerror!: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<VersionHistoryComponent>, // Assurez-vous d'injecter MatDialogRef ici
    private nodeService: NodeService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.refreshData();
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const file = element.files[0];
      this.selectedFileName = file.name; // Mise à jour avec le nom du fichier sélectionné
      
      // Comparaison du type MIME avec le type MIME actuellement importé
      if (this.versions.length > 0 && file.type !== this.versions[0].entry.content.mimeType) {
        this.messagerror="Le type MIME du fichier sélectionné ne correspond pas au type MIME du fichier actuellement importé.";
        this.openFailureSnackBar();
        element.value = ''; // Réinitialise le champ de sélection de fichier
        this.selectedFileName = null; // Réinitialise le nom du fichier sélectionné
        return; // Arrête la mise à jour si les types MIME ne correspondent pas
      }
    } else {
      this.selectedFileName = null; // Réinitialiser si aucun fichier n'est sélectionné
    }
  }
  refreshData() {
    this.nodeService.getVersionHistory(this.data.nodeid).subscribe((res: any) => {
      this.versions = res.list.entries;
      console.log(this.versions);
    });
  }

  onSubmit() {
    if (this.selectedFile) {
      this.nodeService.updateFileContent(this.data.nodeid, this.selectedFile, this.majorVersion, this.comment)
        .subscribe(response => {
          this.refreshData();
          this.dialogRef.close(); // Ferme le dialogue après une opération réussie
        }, error => {
          console.error(error);
          this.dialogRef.close(); // Ferme également le dialogue en cas d'erreur
        });
    }
  }

  downloadSpecificVersion(versionId: string) {
    this.nodeService.downloadFileVersion(this.data.nodeid, versionId).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition') || '';
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      const blob = response.body;
      if (blob) {
        const filename = (matches && matches[1]) ? matches[1] : "downloaded-file";
        saveAs(blob, filename); // Utilisez saveAs pour enregistrer le fichier avec le nom spécifié
      } else {
        console.error('Le corps de la réponse est vide');
      }
    }, error => {
      console.error('Erreur lors du téléchargement de la version spécifique du fichier', error);
    });
  }

  openFailureSnackBar() {
    const snackBarRef = this._snackBar.open(this.messagerror, "Try again!", {
      duration: 55000, // Set the duration as needed
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['red-snackbar'], // Apply your custom CSS class here
    });
  
   }
}