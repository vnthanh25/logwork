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
import { environment } from '../environments/environment';

import { BusinessService } from './business.service';
import { FirebaseService } from './services/firebase.service';

//import { RouterModule } from '@angular/router';
//import { rootRouterConfig } from './app.routes';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatInputModule, MatSliderModule, MatDialogModule } from '@angular/material';

import { AppComponent } from './app.component';
import { GstAddComponent } from './gst-add/gst-add.component';
import { GstGetComponent } from './gst-get/gst-get.component';
import { GstEditComponent } from './gst-edit/gst-edit.component';
import { AvatarDialogComponent } from './avatar-dialog/avatar-dialog.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditUserResolver } from './edit-user/edit-user.resolver';
import { NewUserComponent } from './new-user/new-user.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    GstAddComponent,
    GstGetComponent,
    GstEditComponent,
    AvatarDialogComponent,
    EditUserComponent,
    NewUserComponent,
    HomeComponent
  ],
  entryComponents: [AvatarDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlimLoadingBarModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatDialogModule,
    // configure the imports
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })
  ],
  providers: [ BusinessService, FirebaseService, EditUserResolver ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// import { RouterModule } from '@angular/router';
// import { rootRouterConfig } from './app.routes';

// import { AppComponent } from './app.component';
// import { AvatarDialogComponent } from './avatar-dialog/avatar-dialog.component';
// import { EditUserComponent } from './edit-user/edit-user.component';
// import { EditUserResolver } from './edit-user/edit-user.resolver';
// import { NewUserComponent } from './new-user/new-user.component';
// import { HomeComponent } from './home/home.component';

// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { environment } from '../environments/environment';
// import { FirebaseService } from './services/firebase.service';

// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {MatButtonModule, MatInputModule, MatSliderModule, MatDialogModule } from '@angular/material';


// @NgModule({
//   declarations: [
//     AppComponent,
//     AvatarDialogComponent,
//     EditUserComponent,
//     NewUserComponent,
//     HomeComponent
//   ],
//   entryComponents: [AvatarDialogComponent],
//   imports: [
//     BrowserModule,
//     FormsModule,
//     ReactiveFormsModule,
//     RouterModule.forRoot(rootRouterConfig, { useHash: false, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled'}),
//     AngularFireModule.initializeApp(environment.firebase),
//     AngularFirestoreModule,
//     BrowserAnimationsModule,
//     MatButtonModule,
//     MatInputModule,
//     MatSliderModule,
//     MatDialogModule
//   ],
//   providers: [FirebaseService, EditUserResolver],
//   bootstrap: [AppComponent],
//   schemas: [
//     CUSTOM_ELEMENTS_SCHEMA
//   ]
// })
// export class AppModule { }
