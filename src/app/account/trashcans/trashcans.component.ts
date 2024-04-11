import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NodeService } from '../../service/node.service';
import { AbstractRepositoryComponent } from '../../AbstractRepositoryComponent';
import { CustumSnackbarService } from '../../custom-snackbar/custum-snackbar.service';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trashcans',
  templateUrl: './trashcans.component.html',
  styleUrl: './trashcans.component.scss'
})
export class TrashcansComponent extends AbstractRepositoryComponent implements OnInit{
checkedNodes: { [id: string]: boolean } = {};
 currentTrash:any;
  constructor(
    private datePipe:DatePipe,
    protected override sanitizer: DomSanitizer,
    protected override dialog: MatDialog,
    protected node: NodeService,
    protected override auth: AuthServiceService,
    protected override router: Router,
    protected override cdr: ChangeDetectorRef,
    public _snackbar:CustumSnackbarService,
    protected override authService:AuthServiceService
    ) {
      super(sanitizer, dialog, node, auth, router, cdr,authService); // Appel du constructeur de la classe parente avec les arguments requis
    }
  override ngOnInit(): void {
    this.showFolder();
    this.node.getDeleteNode().subscribe(
      (data: any) => {
       // this.currentNode = data['list'].entries;
       this.currentTrash = data['list'].entries.map((entry: any) => entry.entry);
       // this.count = data['list'].pagination;
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

    this.showFolder();
  }


  deleteSelected(): void {
    const selectedNodeIds = Object.keys(this.checkedNodes).filter(id => this.checkedNodes[id]);
    selectedNodeIds.forEach(nodeId => {
      const nodeName = this.currentNode.find((node:any) => node.id === nodeId)?.name;
      this.trashcanAction(nodeId, nodeName,'permanentDel');
    });
  }

  onCheckboxChange(nodeId: string, isChecked: boolean): void {
    this.checkedNodes[nodeId] = isChecked;
  }
  formatDeletedDate(date: string): string {
    return this.datePipe.transform(date, 'fullDate') || '';
  }
  

}
