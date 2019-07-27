import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from '../routings/user-routing.module';
import { UserCreateComponent } from '../components/user/user-create.component';
import { UserEditComponent } from '../components/user/user-edit.component';
import { UserEditResolver } from '../components/user/user-edit.resolver';
import { UserListComponent } from '../components/user/user-list.component';
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
import { DialogOkCancelComponent } from '../components/dialog/dialog-ok-cancel.component';

export function UserHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/user/', '.json');
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
        UserRoutingModule,
        /* TranslateModule.forChild({
            loader: {provide: TranslateLoader, useClass: CustomLoader},
            compiler: {provide: TranslateCompiler, useClass: CustomCompiler},
            parser: {provide: TranslateParser, useClass: CustomParser},
            missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomHandler},
            isolate: true
        }) */
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: UserHttpLoaderFactory,
                deps: [HttpClient]
            },
            useDefaultLang: true,
            isolate: true,
            //missingTranslationHandler: [{provide: MissingTranslationHandler, useClass: TranslateHandler}]
        })
    ],
    exports: [
        CommonModule,
        RouterModule,
        //TranslateModule
    ],
    declarations: [
        UserListComponent,
        UserCreateComponent,
        UserEditComponent
    ],
    providers: [
        UserEditResolver
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class UserModule {
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
