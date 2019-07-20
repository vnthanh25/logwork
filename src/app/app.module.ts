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
import { ExcelService } from './services/excel.service';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatInputModule, MatSliderModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';

import { AppComponent } from './app.component';
import { GstAddComponent } from './gst-add/gst-add.component';
import { GstGetComponent } from './gst-get/gst-get.component';
import { GstEditComponent } from './gst-edit/gst-edit.component';
import { AvatarDialogComponent } from './avatar-dialog/avatar-dialog.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditUserResolver } from './edit-user/edit-user.resolver';
import { NewUserComponent } from './new-user/new-user.component';
import { HomeComponent } from './home/home.component';
import { ActivityListComponent } from './components/activity/activity-list.component';
import { ActivityCreateComponent } from './components/activity/activity-create.component';
import { ActivityEditResolver } from './components/activity/activity-edit.resolver';
import { ActivityEditComponent } from './components/activity/activity-edit.component';

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

@NgModule({
  declarations: [
    AppComponent,
    GstAddComponent,
    GstGetComponent,
    GstEditComponent,
    AvatarDialogComponent,
    EditUserComponent,
    NewUserComponent,
    HomeComponent,
    ActivityListComponent,
    ActivityCreateComponent,
    ActivityEditComponent
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
        }
    })
  ],
  providers: [ BusinessService, FirebaseService, EditUserResolver, ActivityEditResolver, ExcelService,
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

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}
