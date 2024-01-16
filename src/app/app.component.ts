import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from './service/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'udigitalworkspace';

  constructor(private router: Router, private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.checkTokenValidity();
    this.navigateToLastRoute();
  }

  navigateToLastRoute(): void {
    const lastRoute = localStorage.getItem('lastRoute') || '/dashboard/repository'; // Fournir une route par défaut
    this.router.navigateByUrl(lastRoute);
  }

  checkTokenValidity(): void {
    if (this.authService.getToken()) {
      this.authService.validateToken()
        .subscribe(
          res => {
            // Logique supplémentaire si nécessaire
          },
          err => {
            if (err.statusCode === 401) {
              this.router.navigateByUrl('/login');
            }
          }
        );
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
