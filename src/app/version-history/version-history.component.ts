import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NodeService } from '../service/node.service';
import saveAs from 'file-saver';

@Component({
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.scss'] // Correction: 'styleUrl' à 'styleUrls'
})
export class VersionHistoryComponent implements OnInit {
  versions: any;
  displayedColumns: string[] = ['name', 'versionComment', 'modified', 'modifiedby', 'mimeTypeName', 'version', 'action'];
  selectedFile: File | null = null;
  majorVersion = false;
  comment = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    //private dialogRef: MatDialogRef<VersionHistoryComponent>, // Ajout de MatDialogRef ici
    private node: NodeService
  ) {}

  ngOnInit(): void {
    this.node.getVersionHistory(this.data.nodeid).subscribe((res: any) => {
      this.versions = res['list'].entries;
      console.log(res['list'].entries);
    });
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    }
  }

  // Dans VersionHistoryComponent
refreshData() {
  this.node.getVersionHistory(this.data.nodeid).subscribe((res: any) => {
    this.versions = res['list'].entries;
    console.log(res['list'].entries);
  });
}


  onSubmit() {
    if (this.selectedFile) {
      this.node.updateFileContent(this.data.nodeid, this.selectedFile, this.majorVersion, this.comment)
        .subscribe(response => {
          console.log(response);
          this.refreshData(); // Ferme le dialogue après une opération réussie
        }, error => {
          console.error(error);
         // this.dialogRef.close(); // Ferme également le dialogue en cas d'erreur
        });
    }
  }

  downloadSpecificVersion(versionId: string) {
    this.node.downloadFileVersion(this.data.nodeid, versionId).subscribe(response => {
      // Ici, response est de type HttpResponse<Blob>, et response.body est de type Blob
      const blob = response.body;
      if (blob) {
        saveAs(blob); // Utilisez fileSaverSaveAs pour enregistrer le fichier
      } else {
        console.error('Le corps de la réponse est vide');
      }
    }, error => {
      console.error('Erreur lors du téléchargement de la version spécifique du fichier', error);
    });
  }
  

}
