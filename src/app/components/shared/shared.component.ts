import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NodeService } from '../../service/node.service';
import { AuthServiceService } from '../../service/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractRepositoryComponent } from '../../AbstractRepositoryComponent';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrl: './shared.component.scss'
})
export class SharedComponent extends AbstractRepositoryComponent {
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
  ) {
    super(sanitizer, dialog, nodeService, auth, router, cdr); // Appel du constructeur de la classe parente avec les arguments requis
  }

  override ngOnInit(): void {
    super.ngOnInit(); // Assurez-vous d'appeler la méthode ngOnInit de la classe de base
    this.showFolder();
    
  }
}
