import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NodeService } from '../service/node.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss']
})
export class CommentDialogComponent implements OnInit {
  myForm!: FormGroup;
  comments: any[] = []; // Initialisez comments comme un tableau vide
  private subscriptions = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CommentDialogComponent>,
    private nodeService: NodeService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      content: ['', Validators.required],
    });
    this.getComments(); // Appelez la méthode pour récupérer les commentaire
  
  }



  // Fonction pour déterminer les classes CSS en fonction des propriétés du commentaire
// Fonction pour déterminer les classes CSS en fonction des propriétés du commentaire
getCommentClasses(comment: any): string {
  if (comment.entry.createdBy.id==localStorage.getItem('userId')) {
    return 'chat-message me';
  } else {
    return 'chat-message other';
  }
}


  getComments() {
    this.nodeService.getComment(this.data.nodeid).subscribe((response: any) => {
      this.comments = response['list'].entries.sort(this.sortComments.bind(this));
      console.log(this.comments);
    });
  }
  
  sortComments(a: any, b: any): number {
    const dateA = new Date(a.entry.createdAt);
    const dateB = new Date(b.entry.createdAt);
  
    // Comparaison des dates
    if (dateA > dateB) {
      return 1;
    } else if (dateA < dateB) {
      return -1;
    } else {
      // Si les dates sont égales, comparer par l'identifiant de l'utilisateur
      const idA = a.entry.createdBy.id;
      const idB = b.entry.createdBy.id;
  
      if (idA > idB) {
        return 1;
      } else if (idA < idB) {
        return -1;
      } else {
        // Si les identifiants sont également égaux, comparer par la propriété canEdit
        const canEditA = a.entry.canEdit ? 1 : 0;
        const canEditB = b.entry.canEdit ? 1 : 0;
  
        return canEditA - canEditB;
      }
    }
  }
  
  
  
  

  addComment() {
    if (this.myForm.invalid) {
      return;
    }

    const nodeData = { content: this.myForm.value.content };
    this.subscriptions.add(
      this.nodeService.addComment(this.data.nodeid, nodeData).subscribe(
        (res: any) => {
          this.snackBar.open('Commentaire ajouté avec succès', 'Fermer', { duration: 3000 });
          this.getComments(); // Rafraîchissez les commentaires après en avoir ajouté un nouveau
        },
        error => {
          this.snackBar.open('Échec de l\'ajout du commentaire', 'Fermer', { duration: 3000 });
        }
      )
    );

    this.myForm.reset();
  }
}
