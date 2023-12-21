import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
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
export class CommentDialogComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;
  comment: any;
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

    this.subscriptions.add(
      this.nodeService.getComment(this.data.nodeid).subscribe((response: any) => {
        this.comment = response['list'].entries;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  transform(value: string | null): any {
    if (value === null) {
      return ''; // ou une autre valeur par défaut appropriée
    }
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return this.sanitizer.bypassSecurityTrustHtml(doc.documentElement.textContent || '');
  }
  
  addComment() {
    if (this.myForm.invalid) {
      return;
    }

    const nodeData = { content: this.myForm.value.content };
    this.subscriptions.add(
      this.nodeService.addComment(this.data.nodeid, nodeData).subscribe(
        (res: any) => {
          this.snackBar.open('Comment added successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true); // close the dialog and indicate success
        },
        error => {
          this.snackBar.open('Failed to add comment', 'Close', { duration: 3000 });
        }
      )
    );

    this.myForm.reset();
  }
}
