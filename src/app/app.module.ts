import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { LoginComponent } from './start/login/login.component';
import { DashboardComponent } from './start/dashboard/dashboard.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { MyfilesComponent } from './components/myfiles/myfiles.component';
import { SharedComponent } from './components/shared/shared.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UploadPopupComponent } from './modal/upload-popup/upload-popup.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PdfViewerDialogComponent } from './pdf-viewer-dialog/pdf-viewer-dialog.component';
import { SafeUrlPipe } from './pdf-viewer-dialog/safe-url.pipe';
import { DocumentEditorModule } from '@onlyoffice/document-editor-angular';
import { WordPreviewDialogComponent } from './word-preview-dialog/word-preview-dialog.component';
import { ScannerDialogComponent } from './scanner-dialog/scanner-dialog.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { VersionHistoryComponent } from './version-history/version-history.component';
import { FolderDialogComponent } from './folder-dialog/folder-dialog.component';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';
import { TrashcanComponent } from './trashcan/trashcan.component';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';
import { AccountComponent } from './account/account.component';
import { PasswordResetComponent } from './account/password-reset/password-reset.component';
import { SiteComponent } from './account/site/site.component';
import { GroupeComponent } from './account/groupe/groupe.component';
import { GeneralComponent } from './account/general/general.component';
import { TrashcansComponent } from './account/trashcans/trashcans.component';


// ...

registerLocaleData(fr.default);
import * as fr from '@angular/common/locales/fr';
import { UpdateFolderComponent } from './folder-dialog/update-folder/update-folder.component';


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RepositoryComponent,
    MyfilesComponent,
    SharedComponent,
    UploadPopupComponent,
    PdfViewerDialogComponent,
    SafeUrlPipe,
    WordPreviewDialogComponent,
    ScannerDialogComponent,
    HomeComponent,
    NotFoundComponent,
    VersionHistoryComponent,
    FolderDialogComponent,
    CommentDialogComponent,
    TrashcanComponent,
    CustomSnackbarComponent,
    AccountComponent,
    PasswordResetComponent,
    SiteComponent,
    GroupeComponent,
    GeneralComponent,
    TrashcansComponent,
    UpdateFolderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    DocumentEditorModule
  ],
  providers: [  
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // Assurez-vous de définir également le bon locale ici
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
