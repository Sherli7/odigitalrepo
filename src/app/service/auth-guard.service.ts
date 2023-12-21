// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
