import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthServiceService } from '../../service/auth-service.service';
import { NavigationEnd, Router } from '@angular/router';
import { FolderDialogComponent } from '../../folder-dialog/folder-dialog.component';
import { NodeService } from '../../service/node.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UploadPopupComponent } from '../../modal/upload-popup/upload-popup.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {

  searchControl = new FormControl();
  searchResults: any[] = [];
  userId!: string;
  parentStack: any[] = [];
  private searchSubscription: Subscription | undefined;
  currentNode: any;
  nodeprecedent!: string;
  title: string | undefined;

  constructor(
    private dialog: MatDialog,
    public  auth: AuthServiceService,
    private route: Router,
    private node: NodeService
  ) {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      localStorage.setItem('lastRoute', event.url);
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId") || '';

    this.searchSubscription = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        return this.node.searchFullText(term);
      })
    ).subscribe((data: any) => {
      this.searchResults = data;
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  performSearch(term: any): void {
    if (term) {
      this.node.searchFullText(term).subscribe(
        (data: any) => {
          console.log('Data from search:', data);
          const normalizedTerm = this.normalizeString(term);
          const filteredResults = data['list'].entries.filter((item: any) => 
            item.entry.nodeType && this.normalizeString(item.entry.nodeType).includes(normalizedTerm)
          );
          this.searchResults = filteredResults;
        },
        (error: any) => {
          console.error('Erreur lors de la recherche', error);
        }
      );
    } else {
      this.searchResults = [];
    }
  }

  normalizeString(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  changeRoot() {
    localStorage.removeItem('relativePath');
  }

  findChildren(nodeid: string): void {
    localStorage.setItem("currentNodeId", nodeid);
    if (this.parentStack.length === 0 || this.parentStack[this.parentStack.length - 1] !== nodeid) {
      // Ajoutez nodeid à parentStack uniquement s'il est différent du dernier élément
      this.parentStack.push(nodeid);
      this.nodeprecedent = "Retour";
    }

    this.node.getSpecificNode(nodeid).subscribe(
      (data: any) => {
        this.currentNode = data['list'].entries;
        console.log("Current stack", this.parentStack);

        console.log(data);
        console.log(this.currentNode);
      },
      (error: any) => {
        if (error.status === 401) {
          console.error('Unauthorized access. Please log in.');
          this.route.navigate(['/login']);
          this.auth.logout();
        } else {
          // Handle other errors, log them, or show appropriate messages.
          console.error('An error occurred:', error);
        }
      }
    );
  }

  titleChange(title: string) {
    this.title = title;
  }

  OpenUploadPopup() {
    const popup = this.dialog.open(UploadPopupComponent, {
      width: '90%',
      height: 'auto',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        title: 'Upload a file'
      }
    });

    popup.afterClosed().subscribe(item => {
      console.log(item);
    });
  }

  OpenFolderFormPopup() {
    let specNode = '';
    switch (localStorage.getItem('lastRoute')) {
      case '/dashboard/repository':
        specNode = '-root-';
        break;
      case '/dashboard/shared':
        specNode = '-shared-';
        break;
      case '/dashboard/myfiles':
        specNode = '-my-';
        break;
      default:
        break;
    }
    const popup = this.dialog.open(FolderDialogComponent, {
      position: {
        top: '15px',
      },
      data: { name: 'Créer un nouveau dossier', specNode }
    });
    this.findChildren(localStorage.getItem('currentNodeId') || '');
    popup.afterClosed().subscribe(item => {
      console.log(item);
    });
  }

  logout() {
    this.auth.logout(); // Assume this method clears the token
    localStorage.removeItem('relativePath');
  }

  signout() {
    this.auth.logout();
    this.route.navigate(['login']);
  }

}
