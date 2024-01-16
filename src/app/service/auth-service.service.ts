import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  login(credentials: { userId: string, password: string }): Observable<any> {
    return this.http.post<any>(API.AUTHENTICATION, credentials)
      .pipe(
        map(res => {
          // Stocker le token et les autres informations dans le stockage local
          localStorage.setItem('token', res.entry.id);
          localStorage.setItem('userId', res.entry.userId);
          this.currentUserSubject.next(res.entry.id);
          return res;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  validateToken(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    return this.http.get(API.CHECKVALIDTICKET + token).pipe(
      map(response => {
        // Vous pouvez ajouter ici une logique supplémentaire si nécessaire
        return response;
      }),
      catchError(error => {
        this.logout(); // Déconnecter l'utilisateur si le token n'est pas valide
        return throwError(error);
      })
    );
  }
}
