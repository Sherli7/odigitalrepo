import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpClient) { }

  getPeople(): Observable<any> {
    return this.http.get(API.PEOPLE+'/people?alf_ticket='+localStorage.getItem('token'));
  }
  createUser() {
    const body = {
      "id": "test",
      "firstName": "Test",
      "lastName": "User",
      "password": "test",
      "email": "test@alfresco.com"
    };

    this.http.post(`${API.PEOPLE}/people`, body).subscribe(
      response => console.log('User created:', response),
      error => console.error('Error creating user:', error)
    );
  }

  createGroup() {
    const body = {
      "id": "engineering",
      "displayName": "Engineering"
    };

    this.http.post(`${API.PEOPLE}/groups`, body).subscribe(
      response => console.log('Group created:', response),
      error => console.error('Error creating group:', error)
    );
  }

  addToGroup(groupId: string, memberId: string, memberType: 'GROUP' | 'PERSON') {
    const body = {
      "id": memberId,
      "displayName": memberId,
      "memberType": memberType
    };

    this.http.post(`${API.PEOPLE}/groups/${groupId}/members`, body).subscribe(
      response => console.log('Member added to group:', response),
      error => console.error('Error adding member to group:', error)
    );
  }
}