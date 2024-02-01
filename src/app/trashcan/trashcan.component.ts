import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractRepositoryComponent } from '../AbstractRepositoryComponent';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';
import { NodeService } from '../service/node.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CustumSnackbarService } from '../custom-snackbar/custum-snackbar.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trashcan',
  templateUrl: './trashcan.component.html',
  styleUrl: './trashcan.component.scss'
})
export class TrashcanComponent extends AbstractRepositoryComponent{
restoreDeletedNode(arg0: any,arg1: any) {
throw new Error('Method not implemented.');
}

showTrashFolder(): void {
  // Check if a relative path exists in localStorage
  const relativePath = localStorage.getItem('relativePath');
  // Determine the node parameter based on the existence of relativePath
  const nodeParam = relativePath ? '&relativePath=' + relativePath : '';
  this.nodeService.getSpecificNode(nodeParam).subscribe(
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

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  messagerror!: string;
  
  constructor( private datePipe: DatePipe,
    protected override sanitizer: DomSanitizer,
    protected override dialog: MatDialog,
    protected node: NodeService,
    protected override auth: AuthServiceService,
    protected override router: Router,
    protected override cdr: ChangeDetectorRef,
    public _snackbar:CustumSnackbarService
  ) {
    super(sanitizer, dialog, node, auth, router, cdr); // Appel du constructeur de la classe parente avec les arguments requis
  }

  override ngOnInit(): void {
    super.ngOnInit(); // Call to ngOnInit of AbstractRepositoryComponent if it's implemented
    this.fetchDeletedNodes();
    this.showTrashFolder();
  }

  // A separate method to fetch deleted nodes, for better structure and readability
  private fetchDeletedNodes(): void {
    this.node.getDeleteNode().subscribe({
      next: (data: any) => {
        this.currentNode = data['list'].entries;
        this.count = data['list'].pagination;
        // Perform additional actions if necessary
        console.log('Fetched data:', data);
        console.log('Current nodes:', this.currentNode);
      },
      error: (error: any) => this.handleError(error)
    });
  }

  
  formatDeletedDate(date: string): string {
    return this.datePipe.transform(date, 'EEEE, d MMMM, y, HH:mm:ss') || '';
  }
  // A separate method to handle errors, for better structure and readability
  private handleError(error: any): void {
    if (error.status === 401) {
      console.error('Unauthorized access. Please log in.');
      this.auth.logout();
      this.router.navigate(['/login']);
    } else {
      // Log the error or display a message using your custom snackbar service
      console.error('An error occurred:', error);
      //this._snackbar.showSnackbar('An error occurred while fetching deleted nodes', 'error');
    }
  }
  
}