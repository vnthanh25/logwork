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
import { Routes, RouterModule } from '@angular/router';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatInputModule, MatSliderModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule } from '@angular/material';
import { I18nProvider } from '../providers/I18nProvider';

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
        ActivityEditComponent
    ],
    providers: [
        ActivityEditResolver
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ActivityModule {
    constructor(
        private translate: TranslateService,
        private i18nProvider: I18nProvider
    ) {
        this.translate.use(this.i18nProvider.defaultLanguage);
        this.i18nProvider.eventLanguageChange.subscribe(language => {
          this.translate.use(language);
        });
    }
}
