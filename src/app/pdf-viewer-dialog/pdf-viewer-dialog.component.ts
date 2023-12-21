// pdf-viewer-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-pdf-viewer-dialog',
  templateUrl: './pdf-viewer-dialog.component.html'
})
export class PdfViewerDialogComponent {
  pdfUrl: string;
  filename: string;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.pdfUrl = data.pdfUrl;
    this.filename = data.filename;
  }

  downloadPdf(): void {
    saveAs(this.pdfUrl, this.filename); // Utilisez le nom du fichier passé
  }
}