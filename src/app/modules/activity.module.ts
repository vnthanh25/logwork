import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityRoutingModule } from '../routings/activity-routing.module';
import { ActivityCreateComponent } from '../components/activity/activity-create.component';
import { ActivityEditComponent } from '../components/activity/activity-edit.component';
import { ActivityEditResolver } from '../components/activity/activity-edit.resolver';
import { ActivityListComponent } from '../components/activity/activity-list.component';
import { TranslateModule, TranslateLoader, TranslateService, MissingTranslationHandler, TranslateCompiler, TranslateParser } from '@ngx-translate/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule, Router } from '@angular/router';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatButtonModule, MatInputModule, MatSliderModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, DateAdapter, MAT_DATE_FORMATS, MatCardModule } from '@angular/material';
import { I18nProvider } from '../providers/I18nProvider';
import { DialogOkCancelComponent } from '../components/dialog/dialog-ok-cancel.component';
import { CustomDateAdapter } from '../providers/custom-date-adapter';
import { FlexLayoutModule } from '@angular/flex-layout';

export function ActivityHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/activity/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        SlimLoadingBarModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFirestoreModule,
        AngularFireAuthModule,
        MomentDateModule,
        FlexLayoutModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatSliderModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        HttpClientModule,
        ActivityRoutingModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: ActivityHttpLoaderFactory,
                deps: [HttpClient]
            },
            useDefaultLang: true,
            isolate: true
        })
    ],
    exports: [
        CommonModule,
        RouterModule,
        //TranslateModule
    ],
    declarations: [
        ActivityListComponent,
        ActivityCreateComponent,
        ActivityEditComponent,
        //DialogOkCancelComponent
    ],
    entryComponents: [
      //DialogOkCancelComponent
    ],
    providers: [
        ActivityEditResolver,
        { provide: DateAdapter, useClass: CustomDateAdapter },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ActivityModule {
    constructor(
        private translate: TranslateService,
        private i18nProvider: I18nProvider,
        private router: Router
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
        };
        this.translate.use(this.i18nProvider.defaultLanguage);
        this.i18nProvider.eventLanguageChange.subscribe(language => {
          this.translate.use(language);
          this.router.navigated = false;
          this.router.navigateByUrl(this.router.url);
        });
    }
}
