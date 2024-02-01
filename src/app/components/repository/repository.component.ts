import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NodeService } from '../../service/node.service';
import { AuthServiceService } from '../../service/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractRepositoryComponent } from '../../AbstractRepositoryComponent';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SearchResultsService } from '../../service/search-results-service.service';
import { NodeNavigationService } from '../../service/node-navigation-service.service';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent extends AbstractRepositoryComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  messagerror!: string;
  constructor(
    protected override sanitizer: DomSanitizer,
    protected override dialog: MatDialog,
    protected override nodeService: NodeService,
    protected override auth: AuthServiceService,
    protected override router: Router,
    protected override cdr: ChangeDetectorRef,
    private searchResultsService: SearchResultsService,
    private nodeNavigationService: NodeNavigationService
  ) {
    super(sanitizer, dialog, nodeService, auth, router, cdr); // Appel du constructeur de la classe parente avec les arguments requis
  }
  parentNameStacks:any[]= [];

  override ngOnInit(): void {
    super.ngOnInit(); // Assurez-vous d'appeler la méthode ngOnInit de la classe de base
    this.showFolder();
  }

  getRelativePath(){
    this.nodeService.getMyRelativePath('-root-',localStorage.getItem('relativePath')||'').subscribe((res:any)=>{
      console.log(res);
    });
   }

  private subscribeToSearchResults() {
    this.searchResultsService.currentSearchResults.subscribe(results => {
      this.currentNode = results;
      this.cdr.detectChanges(); // Détection des changements pour la mise à jour de l'interface utilisateur
    });
  }
}
