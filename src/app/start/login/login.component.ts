import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AuthServiceService } from '../../service/auth-service.service';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../environnement/environnement';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;
  showForm: boolean = true;
  isLoading: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  userName: any;
  messagerror!: string;
  hidePassword = true;
  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private http:HttpClient
  ) {
    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/dashboard/home');
    }
  }

  login(){
    this.http.post<any>(API.AUTHENTICATION,this.loginForm.value)
    .subscribe((res:any)=>{
      this.userName=res.entry.userId;
      localStorage.setItem('token', res.entry.id);
      localStorage.setItem('userId', res.entry.userId);
      this.messagerror="Heureux de vous revoir "+this.userName;
      this.openSuccessSnackBar();
      this.router.navigateByUrl('/dashboard/home');
    },err=>{
      this.messagerror='Invalid Login Credentials....'
      this.openFailureSnackBar();
      this.router.navigateByUrl('/login');
    })
  }

  openSuccessSnackBar(){
    this._snackBar.open(this.messagerror, "OK", {
      duration: 3000,
      data:{name:this.messagerror},
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['green-snackbar', 'login-snackbar'],
     });
    }//Snackbar that opens with failure background
    openFailureSnackBar(){
      
      this._snackBar.open(this.messagerror, "Try again!", {
      duration: 3000,
      data:{name:this.messagerror},
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['red-snackbar','login-snackbar'],
      });
    }
}
