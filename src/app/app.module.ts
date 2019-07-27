import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import {HttpClient, HttpClientModule} from '@angular/common/http';
// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { FirebaseService } from './services/firebase.service';
import { ExcelService } from './services/excel.service';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatInputModule, MatSliderModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AvatarDialogComponent } from './avatar-dialog/avatar-dialog.component';
import { DialogOkCancelData, DialogOkCancelComponent } from './components/dialog/dialog-ok-cancel.component';
import { UserListComponent } from './components/user/user-list.component';
//import { UserEditComponent } from './components/user/user-edit.component';
//import { UserEditResolver } from './components/user/user-edit.resolver';
//import { UserCreateComponent } from './components/user/user-create.component';
import { HomeComponent } from './home/home.component';
import { ActivityListComponent } from './components/activity/activity-list.component';
import { ActivityCreateComponent } from './components/activity/activity-create.component';
import { ActivityEditResolver } from './components/activity/activity-edit.resolver';
import { ActivityEditComponent } from './components/activity/activity-edit.component';
import { AuthService } from './services/auth.service';
import { EncryptService } from './services/encrypt.service';
import { CommonModule } from '@angular/common';
import { I18nProvider } from './providers/I18nProvider';

export const VN_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/app/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DialogOkCancelComponent,
    AvatarDialogComponent,
    //UserListComponent,
    //UserEditComponent,
    //UserCreateComponent,
    HomeComponent,
    ActivityListComponent,
    ActivityCreateComponent,
    ActivityEditComponent
  ],
  entryComponents: [
    AvatarDialogComponent,
    DialogOkCancelComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SlimLoadingBarModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MomentDateModule,
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    // configure the imports
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        },
        useDefaultLang: true,
        isolate: true
    })
  ],
  exports: [
    CommonModule,
    //TranslateModule
  ],
  providers: [ FirebaseService, ActivityEditResolver, ExcelService,
    AuthService,
    EncryptService,
    I18nProvider,
    //{ provide: MAT_DATE_LOCALE, useValue: 'it' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: VN_FORMATS }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
