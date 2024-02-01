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

      let a = 5;
      let b = 9;
      console.log(`before a: ${a}, b: ${b}`); // a: 9, b: 5
      // Permutation sans variable intermédiaire
      a = a + b; // a=5+9=14
      b = a - b; // b=14-9=5
      a = a - b; // a=14-5=9
      console.log(`after a: ${a}, b: ${b}`); // a: 9, b: 5

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
