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
  searchControl = new FormControl();
  searchResults: any[] = [];
  searchTerm: string = '';
  title='';
  showFiller = false;
  userId!:string;
  opened=true;
  private searchTerms = new Subject<string>();
  constructor(private dialog:MatDialog,private auth:AuthServiceService,private route:Router,
    private node:NodeService,private searchService:SearchResultsService,
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
    const popup = this.dialog.open(FolderDialogComponent, {
      width: '20%',
      height: '30%',
      data: { name: 'Create new folder' }
    });

    popup.afterClosed().subscribe(item => {
      console.log(item);
    });
  }

  islogged: boolean | undefined;


  logout() {
    this.auth.logout(); // Assume this method clears the token
  }
  
  signout() {
    this.auth.logout();
    this.route.navigate(['login']);
  }
}
