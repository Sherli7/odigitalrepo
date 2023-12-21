import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NodeService } from '../../service/node.service';
import { AuthServiceService } from '../../service/auth-service.service';
import { UploadPopupComponent } from '../../modal/upload-popup/upload-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { saveAs as fileSaverSaveAs } from 'file-saver';
import { HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewerDialogComponent } from '../../pdf-viewer-dialog/pdf-viewer-dialog.component';
import { WordPreviewDialogComponent } from '../../word-preview-dialog/word-preview-dialog.component';
import { VersionHistoryComponent } from '../../version-history/version-history.component';
import { CommentDialogComponent } from '../../comment-dialog/comment-dialog.component';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent implements OnInit {
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
  nodeIds:any
  @Input() version!: any;


  constructor(private sanitizer: DomSanitizer,private dialog:MatDialog,private nodeService: NodeService, private auth: AuthServiceService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auth.validateTicket().subscribe(
      data => {
        console.log('Ticket is valid', data);
      },
      error => {
        console.error('Ticket validation error', error);
      }
    );
    localStorage.removeItem('relativePath')
    this.showFolder();
  }
  islogged: boolean | undefined;
  
  getTimeDate(date: string): string {
    const dt1 = new Date(date);
    const dt2 = new Date();
    const timeDifference = (dt2.getTime() - dt1.getTime()) / (24 * 60 * 60 * 1000);
    if (timeDifference < 1) {
      return 'aujourd\'hui';
    } else if (timeDifference < 7) {
      return `${Math.floor(timeDifference)} jour${Math.floor(timeDifference) > 1 ? 's' : ''}`;
    } else if (timeDifference < 30) {
      const weeks = Math.floor(timeDifference / 7);
      return `${weeks} semaine${weeks > 1 ? 's' : ''}`;
    } else if (timeDifference < 365) {
      const months = Math.floor(timeDifference / 30);
      return `${months} mois`;
    } else {
      const years = Math.floor(timeDifference / 365);
      return `${years} an${years > 1 ? 's' : ''}`;
    }
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
      if(this.parentStack.length === 1){
        this.nodeprecedent="Home";
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
  
  
 
  showFolder() {
    this.nodeService.getFolderRoot().subscribe(
      (data: any) => {
        this.currentNode = data['list'].entries;
        this.count = data['list'].pagination;
        this.parentStack.push(this.currentNode[1].entry.parentId);
        localStorage.setItem("currentNodeId",this.currentNode[1].entry.id)
        this.parentNameStack.push("Racine");
        console.log("Initial stack", this.parentStack[0])
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


  OpenUploadpopup(){
    var _popup= this.dialog.open(UploadPopupComponent,{
       width:'80%',
       enterAnimationDuration:'1000ms',
       exitAnimationDuration:'1000ms',
       data:{
         title:'Upload a file'
       }
     });
     _popup.afterClosed().subscribe(item=>{
       console.log(item);
     })
   }

   OpenVersionpopup(nodeid: string){
    this.nodeService.getComment(nodeid).subscribe((response:any)=>{
      console.log(response);
    });
    var _popup= this.dialog.open(VersionHistoryComponent,{
       width:'80%',
       enterAnimationDuration:'1000ms',
       exitAnimationDuration:'1000ms',
       data:{nodeid}
     });
     _popup.afterClosed().subscribe(item=>{
       console.log(item);
     })
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
    (blob: Blob) => {
      fileSaverSaveAs(blob, filename);
    },
    (error: any) => {
      console.error('Error downloading file version:', error);
    }
  );
}

 
}
