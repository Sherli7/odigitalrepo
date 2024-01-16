import { Component, Inject, OnInit } from '@angular/core';
import { UploadPopupComponent } from '../../modal/upload-popup/upload-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthServiceService } from '../../service/auth-service.service';
import { NavigationEnd, Router } from '@angular/router';
import { FolderDialogComponent } from '../../folder-dialog/folder-dialog.component';
import { NodeService } from '../../service/node.service';
import { filter } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  searchTerm: string = '';
  title='';
  showFiller = false;
  userId!:string;
  opened=true;
  searchResults: any;
  constructor(private dialog:MatDialog,private auth:AuthServiceService,private route:Router,
    private node:NodeService){
      this.route.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        localStorage.setItem('lastRoute', event.url);
      });
  }
  ngOnInit(): void {
  this.userId=localStorage.getItem("userId")||'';
  this.node.searchFullText('etat').subscribe(
    data => {
      this.searchResults = data;
      console.log(this.searchResults);
    },
    error => {
      console.error('Erreur lors de la recherche', error);
    }
  );
  }

  titleChange(title:string){
    this.title=title;
  }

  performSearch() {
    if (this.searchTerm) {
      // Appel de la méthode de recherche ici
      console.log('Recherche en cours pour:', this.searchTerm);
      // Par exemple : this.nodeService.searchNodes(this.searchTerm).subscribe(...)
    }
  }
  
  OpenUploadpopup(){
   var _popup= this.dialog.open(UploadPopupComponent,{
      width:'80%',
      enterAnimationDuration:'500ms',
      exitAnimationDuration:'500ms',
      data:{
        title:'Upload a file'
      }
    });
    _popup.afterClosed().subscribe(item=>{
      console.log(item);
    })
  }

  OpenFolderFormpopup(){
    var _popup= this.dialog.open(FolderDialogComponent,{
      width: '20%',
      height:'30%',
       data:{name:'Create new folder'}
     });
     _popup.afterClosed().subscribe(item=>{
       console.log(item);
     })
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
