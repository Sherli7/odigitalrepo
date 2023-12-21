import { Component, Inject, OnInit } from '@angular/core';
import { UploadPopupComponent } from '../../modal/upload-popup/upload-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthServiceService } from '../../service/auth-service.service';
import { Router } from '@angular/router';
import { FolderDialogComponent } from '../../folder-dialog/folder-dialog.component';
export interface Section {
  name: string;
  icon: string;
  routerLink: string;
  action?: () => void;
  color:string
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  folders: Section[] = [
    {
      name: 'home',
      icon: 'home',
      routerLink:'/dashboard/home',
      color:'#f8f9fa'
    },
    {
      name: 'Repository',
      icon: 'folder',
      routerLink:'/dashboard/repository',
      color:'#f8f9fa'
    },
    {
      name: 'My files',
      icon: 'folder_special',
      routerLink:'/dashboard/myfiles',
      color:'#f8f9fa'
    },
    {
      name: 'Shared',
      icon: 'share',
      routerLink:'/dashboard/shared',
      color:'#f8f9fa'
    },
    {
      name: 'New folder',
      icon: 'create_new_folder',
      routerLink: '',
      action: () => this.OpenFolderFormpopup(),
      color:'#f8f9fa'
    },
    {
      name: 'Import a file',
      icon: 'cloud_download',
      routerLink:'',
      action: () => this.OpenUploadpopup(),
      color:'#f8f9fa'
    },
  ];
  title='';
  showFiller = false;
  opened=true;
  constructor(private dialog:MatDialog,private auth:AuthServiceService,private route:Router){
  }
  ngOnInit(): void {
    this.auth.validateTicket();
  }

  titleChange(title:string){
    this.title=title;
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
       width: '40%',
       height:'auto',
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
  

  isUserLoggedIn() {
    if(localStorage.getItem('token')?.toString==null){
      this.route.navigate(['login']);
    }
  }
  
  
  signout() {
    this.auth.logout();
    this.route.navigate(['login']);
  }
}
