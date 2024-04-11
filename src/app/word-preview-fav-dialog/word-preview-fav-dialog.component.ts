import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NodeService } from '../service/node.service';

@Component({
  selector: 'app-word-preview-fav-dialog',
  templateUrl: './word-preview-fav-dialog.component.html',
  styleUrl: './word-preview-fav-dialog.component.scss'
})
export class WordPreviewFavDialogComponent {
  previewData: any;
  selectedNodeType: string = '';
  nodeType: any;
  metadataFields: any[] = []; // Tableau pour stocker les propriétés dynamiques

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private node: NodeService) { }

  ngOnInit(): void {
    this.previewData = this.data.previewData;
    this.nodeTypeFields();
  }

  nodeTypeFields() {
    this.selectedNodeType = this.data.previewData.nodeType;
    this.node.getNodeTypeDefinition().subscribe((node: any) => {
      this.nodeType = node.filter((node: any) => node.name.startsWith(this.selectedNodeType))[0]; // On suppose qu'il y a un seul type de noeud
      if (this.nodeType) {
        for (const key in this.nodeType.properties) {
          if (this.previewData.properties.hasOwnProperty(key)) {
            const fieldName = this.nodeType.properties[key].title; // Nom du champ de nodeType
            let fieldValue = this.previewData.properties[key]; // Valeur correspondante de previewData.properties

            // Convertir la taille du fichier en Mo ou Go si nécessaire
            if (key === 'sizeInBytes') {
              fieldValue = this.formatFileSize(fieldValue);
            }

            this.metadataFields.push({ name: fieldName, value: fieldValue });
            console.log(this.metadataFields);
          }
        }
      }
    });
  }

  formatFileSize(sizeInBytes: number): string {
    const kiloByte = 1024;
    const megaByte = kiloByte * kiloByte;
    const gigaByte = megaByte * kiloByte;

    if (sizeInBytes < megaByte) {
        return (sizeInBytes / kiloByte).toFixed(2) + ' Ko';
    } else if (sizeInBytes < gigaByte) {
        return (sizeInBytes / megaByte).toFixed(2) + ' Mo';
    } else {
        return (sizeInBytes / gigaByte).toFixed(2) + ' Go';
    }
  }
}
