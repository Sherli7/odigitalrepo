import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractRepositoryComponent } from '../../AbstractRepositoryComponent';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { NodeService } from '../../service/node.service';
import { AuthServiceService } from '../../service/auth-service.service';
import { Router } from '@angular/router';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-myfiles',
  templateUrl: './myfiles.component.html',
  styleUrls: ['./myfiles.component.scss']
})
export class MyfilesComponent extends AbstractRepositoryComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  messagerror!: string;
  constructor(
    protected override sanitizer: DomSanitizer,
    protected override dialog: MatDialog,
    protected override nodeService: NodeService,
    protected override auth: AuthServiceService,
    protected override router: Router,
    protected override cdr: ChangeDetectorRef
  ) {
    super(sanitizer, dialog, nodeService, auth, router, cdr); // Appel du constructeur de la classe parente avec les arguments requis
  }

  override ngOnInit(): void {
    super.ngOnInit(); // Assurez-vous d'appeler la méthode ngOnInit de la classe de base
    this.showFolder();
  }

  showFolder(): void {
    this.nodeService.getFolderMyFiles().subscribe(
      (data: any) => {
        this.currentNode = data['list'].entries;
        this.count = data['list'].pagination;
        this.parentStack.push(this.currentNode[1].entry.parentId);
        localStorage.setItem("currentNodeId", this.currentNode[1].entry.id);
        console.log("Initial stack", this.parentStack[0]);
        console.log(data);
        console.log(this.currentNode);
      },
      (error: any) => {
        if (error.status === 401) {
          console.error('Unauthorized access. Please log in.');
          this.auth.logout();
          this.router.navigate(['/login']);
        } else {
          // Handle other errors, log them, or show appropriate messages.
          console.error('An error occurred:', error);
        }
      }
    );
  }

  override findChildren(nodeid: string): void {
    localStorage.setItem("currentNodeId", nodeid);
    if (this.parentStack.length === 0 || this.parentStack[this.parentStack.length - 1] !== nodeid) {
      // Ajoutez nodeid à parentStack uniquement s'il est différent du dernier élément
      this.parentStack.push(nodeid);
      this.nodeprecedent = "Retour";
    }

    this.nodeService.getSpecificNode(nodeid).subscribe(
      (data: any) => {
        this.currentNode = data['list'].entries;
        this.count = data['list'].pagination;
        console.log("Current stack", this.parentStack);

        console.log(data);
        console.log(this.currentNode);
      },
      (error: any) => {
        if (error.status === 401) {
          console.error('Unauthorized access. Please log in.');
          this.router.navigate(['/login']);
          this.auth.logout();
        } else {
          // Handle other errors, log them, or show appropriate messages.
          console.error('An error occurred:', error);
        }
      }
    );
  }
}
