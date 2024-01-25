import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { NodeService } from './service/node.service';
import { AuthServiceService } from './service/auth-service.service';
import { SnackbarComponent } from './modal/snackbar/snackbar.component';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';
import { saveAs as fileSaverSaveAs } from 'file-saver';
import { WordPreviewDialogComponent } from './word-preview-dialog/word-preview-dialog.component';
import { PdfViewerDialogComponent } from './pdf-viewer-dialog/pdf-viewer-dialog.component';
import { VersionHistoryComponent } from './version-history/version-history.component';
import { HttpResponse } from '@angular/common/http';
import { UploadPopupComponent } from './modal/upload-popup/upload-popup.component';

@Component({
    selector: 'app-abstract-repository',
    template: '',
  })
export abstract class AbstractRepositoryComponent implements OnInit {
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
    @Input() version!: any;
  
    constructor(
      protected sanitizer: DomSanitizer,
      protected dialog: MatDialog,
      protected nodeService: NodeService,
      protected auth: AuthServiceService,
      protected router: Router,
      protected cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
      localStorage.removeItem('relativePath')
      this.showFolder();
    }
    islogged: boolean | undefined;
    
  /**
     * Calcule la différence de temps entre une date donnée et la date actuelle,
     * puis retourne une chaîne descriptive.
     * @param date La date à comparer avec la date actuelle.
     * @return Une chaîne de caractères décrivant la différence de temps.
     */
  getTimeDate(date: string): string {
    const givenDate = new Date(date);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - givenDate.getTime();
    const secondsDifference = timeDifference / 1000; // Différence en secondes
  
    if (secondsDifference < 5) {
      return "à l'instant";
    } else if (secondsDifference < 60) {
      return `il y a ${Math.floor(secondsDifference)} seconde${Math.floor(secondsDifference) > 1 ? 's' : ''}`;
    } else if (secondsDifference < 3600) {
      const minutesDifference = Math.floor(secondsDifference / 60);
      return `il y a ${minutesDifference} minute${minutesDifference > 1 ? 's' : ''}`;
    } else if (secondsDifference < 86400) {
      const hoursDifference = Math.floor(secondsDifference / 3600);
      return `il y a ${hoursDifference} heure${hoursDifference > 1 ? 's' : ''}`;
    } else {
      const daysDifference = secondsDifference / (3600 * 24);
  
      if (daysDifference < 1) {
        return 'aujourd\'hui';
      } else if (daysDifference < 7) {
        return `${Math.floor(daysDifference)} jour${daysDifference > 1 ? 's' : ''}`;
      } else if (daysDifference < 30) {
        const weeks = Math.floor(daysDifference / 7);
        return `${weeks} semaine${weeks > 1 ? 's' : ''}`;
      } else if (daysDifference < 365) {
        const months = Math.floor(daysDifference / 30);
        return `${months} mois`;
      } else {
        const years = Math.floor(daysDifference / 365);
        return `${years} an${years > 1 ? 's' : ''}`;
      }
    }
  }
  

  searchFullText(tag:string){
    this.nodeService.searchFullText(tag).subscribe((result:any)=>{
    });
  }

  
    getName(newName: any,nodeType:string) {
      // Vérifie si le dernier élément de la pile est différent du nouveau nom
  
      if (this.parentNameStack.length === 0 || this.parentNameStack[this.parentNameStack.length - 1] !== newName) {
        this.parentNameStack.push(newName);
      }
      if (this.relativePathStack.length === 0 || this.relativePathStack[this.relativePathStack.length - 1] !== newName) {
        this.relativePathStack.push(newName);
        localStorage.setItem('relativePath', this.relativePathStack.join('/'));
        console.log(localStorage.getItem('relativePath'));
      }
      if (this.nodeTypeStak.length === 0 || this.nodeTypeStak[this.nodeTypeStak.length - 1] !== nodeType) {
        this.nodeTypeStak.push(nodeType);
        localStorage.setItem('nodeType', this.nodeTypeStak.join('/'));
        console.log(localStorage.getItem('nodeType'));
      }
  
    }
  
    versionHistory(version:string){
      this.nodeService.getVersionHistory(version).subscribe((response:any)=>{
        this.versionsHistory=response;
      });
    }
  
    previous(): void {
      if (this.parentStack.length > 0) {
        this.parentStack.pop();
        this.parentNameStack.pop();
        this.relativePathStack.pop(); // Retirer le dernier élément du chemin relatif
    
        // Mettre à jour le chemin dans le localStorage  
        if (this.parentStack.length > 0) {
          const newParent = this.parentStack[this.parentStack.length - 1];
          this.findChildren(newParent);
        } else {
          this.showFolder();
          this.relativePathStack = []; // Réinitialiser le chemin relatif pour le dossier racine
        }
      } else {
        console.warn('No parent node.');
      }
    }

    
    trashcanAction(arg0: any, arg1: any,action:string) {
      const dialogRef = this.dialog.open(SnackbarComponent, {
        width: '40%',
        height:'auto',
        data: { arg0, arg1,action}
      });
    
      dialogRef.afterClosed().subscribe((result:any) => {
          this.refreshData();
          console.log(result);
      });
    }
   
    refreshData() {
      if (this.parentStack.length > 0) {
        const currentParentId = this.parentStack[this.parentStack.length - 1];
        this.findChildren(currentParentId);
      } else {
        this.showFolder();
      }
    }
    
    OpenCommentpopup(nodeid:string){
      var _popup= this.dialog.open(CommentDialogComponent,{
         width:'30%',
         enterAnimationDuration:'1000ms',
         exitAnimationDuration:'1000ms',
         data:{nodeid}
       });
       _popup.afterClosed().subscribe(item=>{
         console.log(item);
       })
     }
  
    findChildren(nodeid: string): void {
        localStorage.setItem("currentNodeId",nodeid)
        if (this.parentStack.length === 0 || this.parentStack[this.parentStack.length - 1] !== nodeid) {
          // Ajoutez nodeid à parentStack uniquement s'il est différent du dernier élément
          this.parentStack.push(nodeid);
          this.nodeprecedent="Retour";
        }
  
        this.nodeService.getSpecificNode(nodeid).subscribe(
          (data: any) => {
            this.currentNode = data['list'].entries;
            this.currentPermissions = data['list'].permissions;
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

    hasPermission(node: any, permissionName: string): boolean {
      this.currentPermissions = [...node.permissions.inherited, ...node.permissions.locallySet];
      return this.currentPermissions.some((perm:any) => perm.name === permissionName && perm.accessStatus === 'ALLOWED');
    }
    
    downloadFilesAsZips(nodeIds: string[], filename: string): void {
      this.isLoading = true;
      const requestBody = { nodeIds };
      // Step 1: Initiate the ZIP download
      this.nodeService.multipleFilesAsZip(requestBody).subscribe((response: HttpResponse<any>) => {
        const downloadId = response.body.entry.id;
    
        // Step 2: Check the status of the ZIP download
        const checkStatus = () => {
          this.nodeService.checkZipStatus(downloadId).subscribe((statusResponse: HttpResponse<any>) => {
            if (statusResponse.body.entry.status === 'DONE') {
    
              // Step 3: Download the ZIP file
              this.showGeneratedZipFileStatus(downloadId, filename);
            } else {
              
            this.isLoading = false;
              console.log('ZIP is not ready yet, checking again in a few seconds...');
              setTimeout(checkStatus, 5000); // Check every 5 seconds
            }
          });
        };
    
        checkStatus();
      }, (error: any) => {
        this.isLoading = false;
        console.error('Error initiating zip download:', error);
      });
    }
    
    showGeneratedZipFileStatus(downloadId: string, filename: string): void {
      this.isLoading = false;
      this.nodeService.downloadFileAsZip(downloadId).subscribe((blob: Blob) => {
        fileSaverSaveAs(blob, `${filename}.zip`);
      });
    }
  
    abstract showFolder(): void;
  
    OpenUploadpopup():void {
      const uploadDialogRef = this.dialog.open(UploadPopupComponent, {
        width: '80%',
        enterAnimationDuration: '1000ms',
        exitAnimationDuration: '1000ms',
        data: { title: 'Upload a file' }
      });
    
      // Écoutez l'événement uploadCompleted
      uploadDialogRef.componentInstance.uploadCompleted.subscribe((success: boolean) => {
        if (success) {
          // Ajoutez un délai avant de rafraîchir les données
          setTimeout(() => {
            this.refreshData(); // Rafraîchir les données après un délai
          }, 4000); // Le délai est en millisecondes, ici 1000 ms = 1 seconde
        }
      });
    }
    
  OpenVersionpopup(nodeid: string):void {
    const dialogRef = this.dialog.open(VersionHistoryComponent, {
      width: '80%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: { nodeid }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const instance = dialogRef.componentInstance as VersionHistoryComponent;
        instance.refreshData(); // Appelle la méthode refreshData de VersionHistoryComponent
      }
    });
  }
   
     downloadFile(nodeId: string, filename: string): void {
      this.nodeService.downloadFile(nodeId).subscribe(
        (response: any) => {
          const fileNameFromUrl = filename || this.extractFileNameFromUrl(response.url) || 'file';
    
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
            console.error('Unable to extract file name from URL');
            // Handle the scenario where the file name cannot be extracted
          }
        },
        (error: any) => {
          console.error('Error downloading file:', error);
          // Handle error, show a message, etc.
        }
      );
    }  
  
    previewFile(nodeId: string, filename: string): void {
      if (this.isPdfFile(filename)) {
        this.nodeService.downloadFile(nodeId).subscribe(
          (response: any) => {
            const blob = new Blob([response.body], { type: 'application/pdf' });
            const pdfUrl = window.URL.createObjectURL(blob);
            this.openPdfViewer(pdfUrl,filename);
          },
          (error: any) => {
            console.error('Error downloading file:', error);
          }
        );
      } else if (this.isWordFile(filename)) {
        // Logique pour la prévisualisation des fichiers Word
        this.nodeService.downloadFile(nodeId).subscribe(
          (response: any) => {
            const wordUrl = window.URL.createObjectURL(new Blob([response.body]));
            this.openWordViewer(wordUrl, filename);
          },
          (error: any) => {
            console.error('Error downloading file:', error);
          }
        );
      } else {
        console.log('Type de fichier non pris en charge pour la prévisualisation.');
      }
    }
  
    isWordFile(filename: string): boolean {
      return filename.toLowerCase().endsWith('.doc') || filename.toLowerCase().endsWith('.docx');
    }
  
    isPdfFile(filename: string): boolean {
      return filename.toLowerCase().endsWith('.pdf');
    }
  
    openWordViewer(wordUrl: string, filename: string): void {
      this.dialog.open(WordPreviewDialogComponent, {
        width: '45%',
        data: { wordUrl, filename } 
      });
    } 
    
    openPdfViewer(pdfUrl: string, filename: string): void {
      this.dialog.open(PdfViewerDialogComponent, {
        width: '90%',
        panelClass: 'custom-dialog-animation',
        data: { pdfUrl, filename } 
      });
    }
    
    // Function to extract file name from a URL
    private extractFileNameFromUrl(url: string): string | null {
      const matches = /\/([^\/?#]+)[^\/]*$/.exec(url);
      return matches ? matches[1] : null;
    }
    
     isUserLoggedIn() {
       if(localStorage.getItem('token')?.toString==null){
         this.router.navigate(['login']);
       }
     }
     
     signout() {
       this.auth.logout();
       this.router.navigate(['login']);
     }
    
     // Function to get the version history of a file
  getFileVersionHistory(nodeId: string): void {
    this.nodeService.getVersionHistory(nodeId).subscribe(
      (versionHistory: any) => {
        console.log('Version history:', versionHistory);
        // Process version history as needed
      },
      (error: any) => {
        console.error('Error retrieving version history:', error);
      }
    );
  }
  
  // Function to download a specific version of a file
  downloadSpecificFileVersion(nodeId: string, versionId: string, filename: string): void {
    this.nodeService.downloadFileVersion(nodeId, versionId).subscribe(
      (file: any) => {
        fileSaverSaveAs(file, filename);
      },
      (error: any) => {
        console.error('Error downloading file version:', error);
      }
    );
  }
  }