import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-word-preview-dialog',
  templateUrl: './word-preview-dialog.component.html',
  styleUrls: ['./word-preview-dialog.component.scss']
})
export class WordPreviewDialogComponent {
  @Input() fileUrl!: string;
  @Input() filename!: string;

  // Vous pouvez ajouter ici d'autres propriétés ou méthodes si nécessaire
}
