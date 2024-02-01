import { Component, OnInit } from '@angular/core';
import { UploadPopupComponent } from '../../modal/upload-popup/upload-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthServiceService } from '../../service/auth-service.service';
import { NavigationEnd, Router } from '@angular/router';
import { FolderDialogComponent } from '../../folder-dialog/folder-dialog.component';
import { NodeService } from '../../service/node.service';
import { BehaviorSubject, Subject, debounceTime, filter, switchMap } from 'rxjs';
import { SearchResultsService } from '../../service/search-results-service.service';
import { FormControl } from '@angular/forms';
import { NodeNavigationService } from '../../service/node-navigation-service.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
changeRoot() {
  localStorage.removeItem('relativePath');
}
  currentPermissions: any;
  currentNode: any;
  versionsHistory: any;
  count: any;
  parentStack: any[] = [];
  nodeprecedent!: string;
  fileUrl: any;
  isLoading = false;
  parentNameStack: any[] = [];
  relativePathStack: any[] = [];
  nodeTypeStak: any[] = [];
  nodeIds: any;
  searchControl = new FormControl();
  searchResults: any[] = [];
  searchTerm: string = '';
  title='';
  showFiller = false;
  userId!:string;
  opened=true;
  private searchTerms = new Subject<string>();
  constructor(
    private dialog:MatDialog,
    private auth:AuthServiceService,
    private route:Router,
    private node:NodeService,
    private searchService:SearchResultsService,
    private nodeNavigationService: NodeNavigationService
    ){
      this.route.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        localStorage.setItem('lastRoute', event.url);
      });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId") || '';

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(term => term ? this.node.searchFullText(term) : [])
    ).subscribe((data: any) => {
      this.searchResults = data['list'].entries.filter((item: any) => 
        item.entry.nodeType && item.entry.nodeType.startsWith('obiv')
      );
      console.log(this.searchResults);
    });
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
        this.count = data['list'].pagination;
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

onSearchInput(event: Event) {
  const term = (event.target as HTMLInputElement).value;
  console.log('Term from input:', term); // Ajout pour le debugging
  this.searchTerms.next(term);
}

normalizeString(str:string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

performSearch(term: string) {
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
      error => {
        console.error('Erreur lors de la recherche', error);
      }
    );
  } else {
    this.searchResults = [];
  }
}





  titleChange(title:string){
    this.title=title;
  }

  OpenUploadPopup() {
    const popup = this.dialog.open(UploadPopupComponent, {
      width: '90%',
      height:'auto',
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
    let specNode='';
    switch (localStorage.getItem('lastRoute')) {
      case '/dashboard/repository':
        specNode='-root-';
        break;
      case '/dashboard/shared':
          specNode='-shared-';
        break;
      case '/dashboard/myfiles':
          specNode='-my-';
        break;
      default:
        break;
    }
    const popup = this.dialog.open(FolderDialogComponent, {
      width: '35%',
      height: 'auto',
      data: { name: 'Nouveau dossier',specNode}
    });
    this.findChildren(localStorage.getItem('currentNodeId')||'');
    popup.afterClosed().subscribe(item => {
      console.log(item);
    });
  }

  islogged: boolean | undefined;


  logout() {
    this.auth.logout(); // Assume this method clears the token
    localStorage.removeItem('relativePath');
  }
  
  signout() {
    this.auth.logout();
    this.route.navigate(['login']);
  }
}
