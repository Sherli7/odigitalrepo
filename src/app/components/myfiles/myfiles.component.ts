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
}
