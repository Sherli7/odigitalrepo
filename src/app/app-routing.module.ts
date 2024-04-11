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
import { TrashcanComponent } from './trashcan/trashcan.component';
import { AccountComponent } from './account/account.component';
import { PasswordResetComponent } from './account/password-reset/password-reset.component';
import { SiteComponent } from './account/site/site.component';
import { GroupeComponent } from './account/groupe/groupe.component';
import { GeneralComponent } from './account/general/general.component';
import { TrashcansComponent } from './account/trashcans/trashcans.component';
import { UploadPopupComponent } from './modal/upload-popup/upload-popup.component';
import { UsersComponent } from './users/users.component';

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
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'trashcan',
        component: TrashcanComponent
      },
      {
        path: 'upload',
        component: UploadPopupComponent
      },
      {
        path: 'account',
        component: AccountComponent,
        children: [
          {
            path: 'password-reset',
            component: PasswordResetComponent // Créez le composant PasswordResetComponent si ce n'est pas déjà fait
          },
          {
            path: 'general',
            component: GeneralComponent // Créez le composant PasswordResetComponent si ce n'est pas déjà fait
          },
          {
            path: 'trashcan',
            component: TrashcansComponent // Créez le composant PasswordResetComponent si ce n'est pas déjà fait
          },
          {
            path: 'site',
            component: SiteComponent // Créez le composant SiteComponent si ce n'est pas déjà fait
          },
          {
            path: 'groupe',
            component: GroupeComponent // Créez le composant GroupeComponent si ce n'est pas déjà fait
          },
          { path: '**', component: NotFoundComponent }
        ]
      },
      { path: '**', component: NotFoundComponent }
    ]
  },
  // Autres routes s'il y en a
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
