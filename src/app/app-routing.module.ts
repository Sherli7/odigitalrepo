import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './start/login/login.component';
import { DashboardComponent } from './start/dashboard/dashboard.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { MyfilesComponent } from './components/myfiles/myfiles.component';
import { SharedComponent } from './components/shared/shared.component';
import { AuthGuard } from './service/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { VersionHistoryComponent } from './version-history/version-history.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'shared',
        component: SharedComponent
      },
      {
        path: 'myfiles',
        component: MyfilesComponent
      },
      {
        path: 'repository',
        component: RepositoryComponent
      },
      {
        path: 'history',
        component: VersionHistoryComponent
      },
      {path:'**',component:NotFoundComponent}
    ],
    
  },
  // If you have other routes, they would go here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
