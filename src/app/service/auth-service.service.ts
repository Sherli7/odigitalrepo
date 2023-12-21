import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API } from '../../environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private currentUserSubject: BehaviorSubject<string | null>;
  public currentUser: Observable<string | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): string | null {
    return this.currentUserSubject.value;
  }

  login(user: string, pw: string) {
    return this.http.get(`${API.LOGIN}?u=${user}&pw=${pw}`, {  
      headers: new HttpHeaders().set('Content-Type', 'text/xml'),
      responseType: 'text'  
    }).pipe(map(token => {
      // login successful if there's a jwt token in the response
      if (token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', token);
        this.currentUserSubject.next(token);
      }

      return token;
    }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(){
    return localStorage.getItem('token');
  }
  
  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  validateTicket(): Observable<any> {
    // Retrieve the token and ensure it's a string before encoding it.
    const token = localStorage.getItem('token') || ''; // Fallback to an empty string if null
  
    const headers = new HttpHeaders({
      'Authorization': "Basic " + btoa(token)
    });
  
    return this.http.get(API.CHECKVALIDTICKET, { headers });
  }
  

}
