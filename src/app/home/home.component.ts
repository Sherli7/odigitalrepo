import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NodeService } from '../service/node.service';
import { AbstractRepositoryComponent } from '../AbstractRepositoryComponent';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';
import { WordPreviewFavDialogComponent } from '../word-preview-fav-dialog/word-preview-fav-dialog.component';
import { PdfViewerDialogComponent } from '../pdf-viewer-dialog/pdf-viewer-dialog.component';
import { VersionHistoryComponent } from '../version-history/version-history.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends AbstractRepositoryComponent implements OnInit {
  favorites: any;
  override parentStack: any[] = [];
  override currentNode: any;
  override nodeprecedent!: string;
  override fileUrl: any;
  override isLoading = false;
  override parentNameStack: any[] = [];
  override nodeTypeStak: any[] = [];
  constructor(
    protected override sanitizer: DomSanitizer,
    protected override dialog: MatDialog,
    protected override nodeService: NodeService,
    protected override auth: AuthServiceService,
    protected override router: Router,
    protected override cdr: ChangeDetectorRef,
    protected override authService:AuthServiceService
    ) {
      super(sanitizer, dialog, nodeService, auth, router, cdr,authService); // Appel du constructeur de la classe parente avec les arguments requis
    }
  override ngOnInit(): void {
    this.loadFavoriteDocuments();
  }

  loadFavoriteDocuments() {
    this.nodeService.getPeopleFavorite().subscribe((response: any) => {
      this.favorites = response['list'].entries;
      console.log(this.favorites);
    });
  }

  isFile(entry: any): boolean {
    return entry && entry.entry && entry.entry.target && entry.entry.target.file;
  }
  findFavChildren(nodeid: string): void {
    localStorage.setItem("currentNodeId", nodeid);
    if (this.parentStack.length === 0 || this.parentStack[this.parentStack.length - 1] !== nodeid) {
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

  override previewFile(nodeId: any, filename: string): void {
    switch (nodeId.content.mimeType) {
      case 'application/pdf':
        this.nodeService.downloadFile(nodeId.id).subscribe(
          (response: any) => {
            const blob = new Blob([response.body], { type: 'application/pdf' });
            const pdfUrl = window.URL.createObjectURL(blob);
            this.openPdfViewer(pdfUrl, filename);
          },
          (error: any) => {
            // Gérer les erreurs de téléchargement ici
          }
        );
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        this.nodeService.downloadFile(nodeId.id).subscribe(
          (response: any) => {
            const wordUrl = window.URL.createObjectURL(new Blob([response.body]));
            this.openWordViewer(nodeId);
          },
          (error: any) => {
            // Gérer les erreurs de téléchargement ici
          }
        );
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        this.nodeService.downloadFile(nodeId.id).subscribe(
          (response: any) => {
            const wordUrl = window.URL.createObjectURL(new Blob([response.body]));
            this.openWordViewer(nodeId);
          },
          (error: any) => {
            // Gérer les erreurs de téléchargement ici
          }
        );
        break;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        this.nodeService.downloadFile(nodeId.id).subscribe(
          (response: any) => {
            const wordUrl = window.URL.createObjectURL(new Blob([response.body]));
            this.openWordViewer(nodeId);
          },
          (error: any) => {
            // Gérer les erreurs de téléchargement ici
          }
        );
        break;
      case 'image/jpeg':
        this.nodeService.downloadFile(nodeId.id).subscribe(
          (response: any) => {
            const wordUrl = window.URL.createObjectURL(new Blob([response.body]));
            this.openWordViewer(nodeId);
          },
          (error: any) => {
            // Gérer les erreurs de téléchargement ici
          }
        );
        break;
      case 'image/png':
        this.nodeService.downloadFile(nodeId.id).subscribe(
          (response: any) => {
            const wordUrl = window.URL.createObjectURL(new Blob([response.body]));
            this.openWordViewer(nodeId);
          },
          (error: any) => {
            // Gérer les erreurs de téléchargement ici
          }
        );
        break;
      case 'image/gif':
        this.nodeService.downloadFile(nodeId.id).subscribe(
          (response: any) => {
            const wordUrl = window.URL.createObjectURL(new Blob([response.body]));
            this.openWordViewer(nodeId);
          },
          (error: any) => {
            // Gérer les erreurs de téléchargement ici
          }
        );
        break;
      // Ajouter d'autres cas pour d'autres types de fichiers si nécessaire
      default:
        // Gérer les autres types de fichiers ici
        console.log('Détails du fichier :', filename);
        break;
    }
  }

  unlikeDocument(favoriteId: string) {
    this.nodeService.removeFavorite(favoriteId).subscribe({
      next: () => {
        this.loadFavoriteDocuments();
      },
      error: (error) => {
        console.error('Une erreur est survenue lors de la suppression du favori : ', error);
      }
    });
  }
  

  override OpenVersionpopup(nodeid: string):void {
    const dialogRef = this.dialog.open(VersionHistoryComponent, {
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      position:{
        top:'15px'
      },
      data: { nodeid }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const instance = dialogRef.componentInstance as VersionHistoryComponent;
        instance.refreshData(); // Appelle la méthode refreshData de VersionHistoryComponent
      }
    });
  }
   
     override downloadFile(nodeId: string, filename: string): void {
      this.nodeService.downloadFile(nodeId).subscribe(
        (response: any) => {
          const fileNameFromUrl = filename || this.extractFileNameFromUrls(response.url) || 'file';
    
          if (fileNameFromUrl) {
            const contentType = response.headers.get('Content-Type');
            const blob = new Blob([response.body], { type: contentType });
    
            // Create a link element and trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileNameFromUrl;
            link.click();
            
            // Clean up resources
            window.URL.revokeObjectURL(link.href);
            link.remove();
          } else {
         //   console.error('Unable to extract file name from URL');
            // Handle the scenario where the file name cannot be extracted
          }
        },
        (error: any) => {
        //  console.error('Error downloading file:', error);
          // Handle error, show a message, etc.
        }
      );
    }  

    override isWordFile(filename: string): boolean {
      return filename.toLowerCase().endsWith('.doc') || filename.toLowerCase().endsWith('.docx');
    }
  
    override isPdfFile(filename: string): boolean {
      return filename.toLowerCase().endsWith('.pdf');
    }
  
    override openWordViewer(previewData:any): void {
      this.dialog.open(WordPreviewFavDialogComponent, {
        data: {previewData} 
      });
    } 
    
    override openPdfViewer(pdfUrl: string, filename: string): void {
      this.dialog.open(PdfViewerDialogComponent, {
        width: '90%',
        panelClass: 'custom-dialog-animation',
        data: { pdfUrl, filename } 
      });
    }
    
    // Function to extract file name from a URL
    extractFileNameFromUrls(url: string): string | null {
      const matches = /\/([^\/?#]+)[^\/]*$/.exec(url);
      return matches ? matches[1] : null;
    }

}