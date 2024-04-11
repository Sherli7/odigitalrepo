import { Component, OnInit } from '@angular/core';
import { NodeService } from '../service/node.service';
import { AddMemberDialogComponentComponent } from './add-member-dialog-component/add-member-dialog-component.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  users:any;
  groups:any;
  constructor(private userService:NodeService,public dialog: MatDialog){

  }
  ngOnInit(): void {
    this.userService.getPeople().subscribe((value: any) => {
      this.users=value['list'].entries;
      console.log(this.users);
    });

    this.userService.getGroups().subscribe((value: any) => {
      this.groups=value['list'].entries;
      console.log(this.groups);
    });
  }

  addUser() {
    // Logique pour ajouter un utilisateur
  }
  
  openAddMemberDialog(member: any, memberType: string) {
    const dialogRef: MatDialogRef<AddMemberDialogComponentComponent, any> = this.dialog.open(AddMemberDialogComponentComponent, {
      width: '250px',
      data: { member: member, memberType: memberType }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // Logic to handle the result
    });
  }
  editUser(user: any) {
    // Logique pour éditer un utilisateur
  }

  deleteUser(user: any) {
    // Logique pour supprimer un utilisateur
  }

  addGroup() {
    // Logique pour ajouter un groupe
  }

  editGroup(group: any) {
    // Logique pour éditer un groupe
  }

  deleteGroup(group: any) {
    // Logique pour supprimer un groupe
  }
}